import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    // Verify user has client clearance and is verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["client"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "newest";
    const status = searchParams.get("status") || "open"; // 'open' or 'closed'
    const search = searchParams.get("search") || "";

    // Build the where clause
    const whereClause: any = {
      creatorId: userId,
    };

    // Filter by status
    if (status === "open") {
      whereClause.status = "open";
    } else if (status === "closed") {
      whereClause.status = {
        in: ["assigned", "completed", "cancelled"],
      };
    }

    // Add search functionality
    if (search.trim()) {
      whereClause.OR = [
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
        {
          skills: {
            hasSome: [search],
          },
        },
      ];
    }

    // Build the orderBy clause
    let orderBy: any;
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "budget-high":
        orderBy = { budget: "desc" };
        break;
      case "budget-low":
        orderBy = { budget: "asc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
      case "bids-high":
        orderBy = { bids: { _count: "desc" } };
        break;
      case "bids-low":
        orderBy = { bids: { _count: "asc" } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Fetch projects with related data
    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy,
      include: {
        bids: true,
        creator: {
          select: {
            receivedReviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match frontend expectations
    const transformedProjects = projects.map((project) => {
      // Calculate client rating and count
      const reviews = project.creator.receivedReviews;
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating =
        reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0";

      // Calculate time ago
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
        budget: `$${project.budget}`,
        bidCount: project.bids.length.toString(),
        postedTime,
        skills: project.skills,
        shortDesc: project.shortDesc,
        clientRating: avgRating,
        ratingCount: reviews.length.toString(),
        status: project.status,
      };
    });

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
