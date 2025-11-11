import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    // Verify user has dev clearance and is verified (only developers can place bids)
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

    // Get search and sort parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "newest";
    const search = searchParams.get("search") || "";

    // Build the where clause for projects
    const projectWhereClause: any = {};

    // Add search functionality to projects
    if (search.trim()) {
      projectWhereClause.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          shortDesc: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          longDesc: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Build the orderBy clause for bids
    let orderBy: any;
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "budget-high":
        orderBy = { project: { budget: "desc" } };
        break;
      case "budget-low":
        orderBy = { project: { budget: "asc" } };
        break;
      case "title":
        orderBy = { project: { title: "asc" } };
        break;
      case "bids-high":
        orderBy = { project: { bids: { _count: "desc" } } };
        break;
      case "bids-low":
        orderBy = { project: { bids: { _count: "asc" } } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Fetch all bids placed by the current user along with project data
    const userBids = await prisma.bid.findMany({
      where: {
        bidderId: userId,
        project: projectWhereClause,
      },
      include: {
        project: {
          include: {
            creator: {
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
            bids: true, // To count total bids on the project
          },
        },
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
      orderBy,
    });

    // Transform the data to match the frontend expectations
    const transformedProjects = userBids.map((bid) => {
      const project = bid.project;

      // Calculate client rating and count
      const clientReviews = project.creator.receivedReviews;
      const clientTotalRating = clientReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const clientAvgRating =
        clientReviews.length > 0
          ? (clientTotalRating / clientReviews.length).toFixed(1)
          : "0";

      // Calculate bidder rating and count
      const bidderReviews = bid.bidder.receivedReviews;
      const bidderTotalRating = bidderReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const bidderAvgRating =
        bidderReviews.length > 0
          ? (bidderTotalRating / bidderReviews.length).toFixed(1)
          : "0";

      // Calculate time ago for project
      const now = new Date();
      const createdAt = new Date(project.createdAt);
      const diffInDays = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      let postedTime;
      if (diffInDays === 0) {
        postedTime = "today";
      } else if (diffInDays === 1) {
        postedTime = "1 day ago";
      } else if (diffInDays < 7) {
        postedTime = `${diffInDays} days ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        postedTime = weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
      } else {
        const months = Math.floor(diffInDays / 30);
        postedTime = months === 1 ? "1 month ago" : `${months} months ago`;
      }

      return {
        id: project.id,
        title: project.title,
        budget: project.budget.toString(),
        bidCount: project.bids.length.toString(),
        postedTime,
        skills: project.skills,
        shortDesc: project.shortDesc,
        clientRating: clientAvgRating,
        ratingCount: clientReviews.length.toString(),
        status: project.status,
        bidData: {
          id: bid.id,
          details: bid.details,
          price: bid.price.toString(),
          completionTime: bid.time,
          bidTime: bid.createdAt,
          bidder: {
            username: bid.bidder.username,
            name: bid.bidder.name || "Unknown User",
            rating: bidderAvgRating,
            ratingCount: bidderReviews.length.toString(),
          },
        },
      };
    });

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching user bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch user bids" },
      { status: 500 }
    );
  }
}
