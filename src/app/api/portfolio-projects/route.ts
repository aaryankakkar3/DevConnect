import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { title, description, links, linkLabels, images, userId } = body;

    // Create the portfolio project
    const portfolioProject = await prisma.portfolioProject.create({
      data: {
        title,
        description,
        links: links || [],
        linkLabels: linkLabels || [],
        images: images || [],
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: portfolioProject,
        message: "Portfolio project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating portfolio project:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create portfolio project",
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

    let portfolioProjects;

    if (userId) {
      // Get portfolio projects for a specific user
      portfolioProjects = await prisma.portfolioProject.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          id: "desc", // Most recent first
        },
      });
    } else {
      // Get all portfolio projects
      portfolioProjects = await prisma.portfolioProject.findMany({
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
          id: "desc",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: portfolioProjects,
        count: portfolioProjects.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching portfolio projects:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch portfolio projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
