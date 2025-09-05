import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user ID from session headers (set by middleware)
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, links, linkLabels, images } = body;

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

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user ID from session headers (set by middleware)
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, description, links, linkLabels, images } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Portfolio project ID is required" },
        { status: 400 }
      );
    }

    // Verify the portfolio project belongs to the authenticated user
    const existingProject = await prisma.portfolioProject.findFirst({
      where: { id: id, userId },
    });

    if (!existingProject) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio project not found or access denied",
        },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.portfolioProject.update({
      where: { id: id },
      data: {
        title,
        description,
        links: links || [],
        linkLabels: linkLabels || [],
        images: images || [],
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedProject,
        message: "Portfolio project updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating portfolio project:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update portfolio project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
