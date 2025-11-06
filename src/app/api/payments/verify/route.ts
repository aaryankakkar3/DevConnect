import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/db/prismaClient";
import { clearCachedUserData } from "@/lib/cache";
import { verifyUserClearance } from "@/lib/authUtils";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tokenCount,
      tokenType,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Verify user authentication and get user ID
    const clearanceCheck = await verifyUserClearance(request, [
      "dev",
      "client",
    ]);

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: 401 }
      );
    }

    const userId = clearanceCheck.userId!;

    // Update user's token count
    const updateField =
      tokenType === "bid" ? "bidTokenCount" : "projectTokenCount";

    await prisma.user.update({
      where: { id: userId },
      data: {
        [updateField]: {
          increment: tokenCount,
        },
      },
    });

    // Clear cache so next fetch gets updated token count
    await clearCachedUserData(userId);

    return NextResponse.json({
      success: true,
      message: "Payment verified and tokens added successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
