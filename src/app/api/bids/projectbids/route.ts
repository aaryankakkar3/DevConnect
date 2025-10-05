import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    // Verify user has client clearance
    const clearanceCheck = await verifyUserClearance(request, ["client"]);

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

    // Verify the project exists and belongs to the client
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        creatorId: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if the current user is the project owner
    if (project.creatorId !== userId) {
      return NextResponse.json(
        { error: "You can only view bids on your own projects" },
        { status: 403 }
      );
    }

    // Fetch all bids for this project with bidder details
    const bids = await prisma.bid.findMany({
      where: { projectId },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            username: true,
            receivedReviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format the response with calculated ratings
    const formattedBids = bids.map((bid) => {
      const reviews = bid.bidder.receivedReviews;
      const ratingCount = reviews.length;
      const averageRating =
        ratingCount > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            ratingCount
          : 0;

      return {
        id: bid.id,
        price: bid.price,
        details: bid.details,
        completionTime: bid.time,
        bidTime: bid.createdAt,
        bidder: {
          name: bid.bidder.name || "Unknown User",
          username: bid.bidder.username,
          rating: Math.round(averageRating * 10) / 10,
          ratingCount: ratingCount,
        },
      };
    });

    return NextResponse.json(formattedBids);
  } catch (error) {
    console.error("Error fetching project bids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
