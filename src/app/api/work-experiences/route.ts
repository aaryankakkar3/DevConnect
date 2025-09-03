import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware headers
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { title, description, proofLink, company, startDate, endDate } = body;

    // Create the work experience entry
    const workExperience = await prisma.workExperience.create({
      data: {
        title,
        description,
        proofLink,
        company,
        startDate,
        endDate,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: workExperience,
        message: "Work experience created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating work experience:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create work experience",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let workExperiences;

    if (userId) {
      // Get work experiences for a specific user
      workExperiences = await prisma.workExperience.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          startDate: "desc", // Most recent first
        },
      });
    } else {
      // Get all work experiences
      workExperiences = await prisma.workExperience.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: workExperiences,
        count: workExperiences.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching work experiences:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch work experiences",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
