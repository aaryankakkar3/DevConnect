import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";

export async function GET(request: NextRequest) {
  try {
    // Verify user has appropriate clearance
    const clearanceCheck = await verifyUserClearance(request, [
      "dev",
      "client",
    ]);

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "most-reviewed";
    const search = searchParams.get("search") || "";

    // Build the where clause for searching developers
    const whereClause: any = {
      clearance: "dev", // Only show developers
    };

    // Add search functionality
    if (search.trim()) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          skills: {
            has: search, // Check if skills array contains the search term
          },
        },
      ];
    }

    // Build the orderBy clause - only two options
    let orderBy: any;
    switch (sortBy) {
      case "most-reviewed":
        orderBy = { receivedReviews: { _count: "desc" } };
        break;
      case "least-reviewed":
        orderBy = { receivedReviews: { _count: "asc" } };
        break;
      default:
        orderBy = { receivedReviews: { _count: "desc" } };
    }

    // Fetch developers with related data
    const developers = await prisma.user.findMany({
      where: whereClause,
      orderBy,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        location: true,
        skills: true,
        gender: true,
        dob: true,
        profilePicture: true,
        receivedReviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Transform the data
    const transformedDevelopers = developers.map((developer) => {
      // Calculate rating and count
      const reviews = developer.receivedReviews;
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating =
        reviews.length > 0
          ? parseFloat((totalRating / reviews.length).toFixed(1))
          : 0;

      return {
        name: developer.name || "Unknown Developer",
        username: developer.username,
        bio: developer.bio || "No bio available",
        location: developer.location || "Location not specified",
        skills: developer.skills,
        gender: developer.gender || "Not specified",
        dob: developer.dob
          ? developer.dob.toISOString().split("T")[0]
          : "Not specified",
        profilePic: developer.profilePicture || null,
        rating: avgRating,
        ratingCount: reviews.length,
        description: developer.bio || "No description available",
      };
    });

    return NextResponse.json(transformedDevelopers);
  } catch (error) {
    console.error("Error fetching developers:", error);
    return NextResponse.json(
      { error: "Failed to fetch developers" },
      { status: 500 }
    );
  }
}
