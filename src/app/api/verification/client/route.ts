import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";
import { clearCachedUserData } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    // Verify user has client clearance and unverified status
    const clearanceCheck = await verifyUserClearance(
      request,
      ["client"],
      ["unverified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;
    const body = await request.json();
    const { gender, dob } = body;

    // Validate required fields for client
    if (!gender || !dob) {
      return NextResponse.json(
        {
          error:
            "Gender and date of birth are required for client verification",
        },
        { status: 400 }
      );
    }

    // Validate gender enum
    if (!["man", "woman", "other"].includes(gender)) {
      return NextResponse.json(
        { error: "Invalid gender value" },
        { status: 400 }
      );
    }

    // Validate date is not in the future
    const dobDate = new Date(dob);
    if (dobDate > new Date()) {
      return NextResponse.json(
        { error: "Date of birth cannot be in the future" },
        { status: 400 }
      );
    }

    // Update user with verification data and change status to requested
    await prisma.user.update({
      where: { id: userId },
      data: {
        gender: gender,
        dob: new Date(dob),
        verificationStatus: "requested",
      },
    });

    // Clear cache so updated data is fetched
    await clearCachedUserData(userId);

    return NextResponse.json(
      { success: true, message: "Client verification submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting client verification:", error);
    return NextResponse.json(
      { error: "Failed to submit verification" },
      { status: 500 }
    );
  }
}
