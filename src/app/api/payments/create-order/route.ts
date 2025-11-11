import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyUserClearance } from "@/lib/authUtils";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["dev", "client"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const { amount, tokenCount, tokenType } = await request.json();

    // Validate input
    if (!amount || !tokenCount || !tokenType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        tokenCount: tokenCount.toString(),
        tokenType: tokenType,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
