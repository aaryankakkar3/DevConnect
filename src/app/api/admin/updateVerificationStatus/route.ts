import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";
import { clearCachedUserData } from "@/lib/cache";

export async function PUT(request: NextRequest) {
  try {
    // Verify user has admin clearance
    const clearanceCheck = await verifyUserClearance(request, ["admin"]);

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const { userId, status } = await request.json();

    // Validate input
    if (!userId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: userId and status" },
        { status: 400 }
      );
    }

    // Validate status value
    if (!["verified", "unverified"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be either 'verified' or 'unverified'" },
        { status: 400 }
      );
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status,
      },
      select: {
        id: true,
        username: true,
        verificationStatus: true,
      },
    });

    // Clear the user's cache
    await clearCachedUserData(userId);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    return NextResponse.json(
      { error: "Failed to update verification status" },
      { status: 500 }
    );
  }
}
