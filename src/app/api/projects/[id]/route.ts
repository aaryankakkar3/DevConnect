import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Fetch project with creator (client) details and bid count
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            // Calculate rating from received reviews
            receivedReviews: {
              select: {
                rating: true,
              },
            },
          },
        },
        bids: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate average rating and count from reviews
    const reviews = project.creator.receivedReviews;
    const ratingCount = reviews.length;
    const averageRating =
      ratingCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount
        : 0;

    // Get bid count
    const bidCount = project.bids.length;

    // Format the response to match your component's expected structure
    const formattedProject = {
      id: project.id,
      title: project.title,
      longDescription: project.longDesc,
      shortDescription: project.shortDesc,
      budget: project.budget.toString(), // Convert to string to match your component
      skills: project.skills, // Already an array
      bidCount: bidCount,
      client: {
        id: project.creator.id,
        name: project.creator.name || "Unknown User",
        email: project.creator.email,
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        ratingCount: ratingCount,
      },
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
