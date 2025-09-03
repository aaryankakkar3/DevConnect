import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch user with all related data in one query
    const userProfile = await prisma.user.findUnique({
      where: { username },
      include: {
        portfolioProjects: {
          orderBy: { id: "desc" },
        },
        workexperiences: {
          orderBy: { startDate: "desc" },
        },
        educations: {
          orderBy: { startDate: "desc" },
        },
        certifications: {
          orderBy: { startDate: "desc" },
        },
        receivedReviews: {
          include: {
            giver: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: userProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
