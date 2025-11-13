import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    // Verify user has admin clearance
    const clearanceCheck = await verifyUserClearance(request, ["admin"]);

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    // Fetch all users with verification status = "requested"
    const unapprovedUsers = await prisma.user.findMany({
      where: {
        verificationStatus: "requested",
      },
      select: {
        id: true,
        name: true,
        username: true,
        profilePicture: true,
        clearance: true,
        dob: true,
        gender: true,
        idPhoto: true,
        selfieCheckPhoto: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      users: unapprovedUsers,
    });
  } catch (error) {
    console.error("Error fetching unapproved users:", error);
    return NextResponse.json(
      { error: "Failed to fetch unapproved users" },
      { status: 500 }
    );
  }
}
