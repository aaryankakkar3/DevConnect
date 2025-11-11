import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    // Verify user has dev clearance and is verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["dev"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;

    // Get projectId from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // Check if user has a bid on this project
    const existingBid = await prisma.bid.findUnique({
      where: {
        bidderId_projectId: {
          bidderId: userId,
          projectId: projectId,
        },
      },
      select: {
        id: true,
        price: true,
        details: true,
        time: true,
        createdAt: true,
      },
    });

    if (existingBid) {
      return NextResponse.json({
        hasBid: true,
        bid: {
          price: existingBid.price,
          details: existingBid.details,
          completionTime: existingBid.time,
          bidTime: existingBid.createdAt,
        },
      });
    } else {
      return NextResponse.json({
        hasBid: false,
        bid: null,
      });
    }
  } catch (error) {
    console.error("Error checking bid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
