import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/portfolio-projects/[id] - Get a specific portfolio project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const portfolioProject = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!portfolioProject) {
      return NextResponse.json(
        { error: "Portfolio project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolioProject);
  } catch (error) {
    console.error("Error fetching portfolio project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio-projects/[id] - Update a portfolio project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { title, description, links, images } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title too long (max 200 characters)" },
        { status: 400 }
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        { error: "Description too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Check if portfolio project exists
    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Portfolio project not found" },
        { status: 404 }
      );
    }

    // Only allow owner to update their portfolio project
    if (existingProject.user.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Process links and images arrays
    let linksArray: string[] = [];
    let imagesArray: string[] = [];

    if (links) {
      if (typeof links === "string") {
        linksArray = links
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      } else if (Array.isArray(links)) {
        linksArray = links;
      }
    }

    if (images) {
      if (typeof images === "string") {
        imagesArray = images
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      } else if (Array.isArray(images)) {
        imagesArray = images;
      }
    }

    const updatedProject = await prisma.portfolioProject.update({
      where: { id },
      data: {
        title,
        description,
        links: linksArray,
        images: imagesArray,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating portfolio project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio-projects/[id] - Delete a portfolio project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if portfolio project exists
    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Portfolio project not found" },
        { status: 404 }
      );
    }

    // Only allow owner to delete their portfolio project
    if (existingProject.user.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.portfolioProject.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Portfolio project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
