import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function POST(request: NextRequest) {
  try {
    // Verify user has dev clearance
    const clearanceCheck = await verifyUserClearance(request, ["dev"]);

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;
    const body = await request.json();
    const { projectId, price, details, time } = body;

    // Validate required fields
    if (!projectId || !price || !details || !time) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, price, details, time" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const priceNum = parseInt(price);
    const timeNum = parseInt(time);

    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    if (isNaN(timeNum) || timeNum <= 0) {
      return NextResponse.json(
        { error: "Completion time must be a positive number" },
        { status: 400 }
      );
    }

    // Check if project exists and is open
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        status: true,
        creatorId: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.status !== "open") {
      return NextResponse.json(
        { error: "Project is not open for bidding" },
        { status: 400 }
      );
    }

    // Check if developer is trying to bid on their own project (shouldn't happen since only clients create projects, but safety check)
    if (project.creatorId === userId) {
      return NextResponse.json(
        { error: "You cannot bid on your own project" },
        { status: 400 }
      );
    }

    // Check if user already has a bid on this project (unique constraint will handle this, but better UX to check first)
    const existingBid = await prisma.bid.findUnique({
      where: {
        bidderId_projectId: {
          bidderId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingBid) {
      return NextResponse.json(
        { error: "You have already placed a bid on this project" },
        { status: 400 }
      );
    }

    // Create the bid
    await prisma.bid.create({
      data: {
        bidderId: userId,
        projectId: projectId,
        price: priceNum,
        details: details,
        time: timeNum,
      },
    });

    return NextResponse.json(
      { message: "Bid placed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bid:", error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "You have already placed a bid on this project" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
