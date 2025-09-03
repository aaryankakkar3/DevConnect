import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

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
    const { title, description, links, linkLabels, images } = body;

    // Create the portfolio project entry
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get portfolio projects for this user
    const portfolioProjects = await prisma.portfolioProject.findMany({
      where: { userId: user.id },
      orderBy: { id: "desc" },
    });

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
