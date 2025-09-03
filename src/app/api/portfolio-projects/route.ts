import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware headers
    const userId = request.headers.get("x-user-id");
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - No user ID found" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { title, description, links, linkLabels, images } = body;

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

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
