import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/work-experiences/[id] - Get a specific work experience
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const workExperience = await prisma.workExperience.findUnique({
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

    if (!workExperience) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workExperience);
  } catch (error) {
    console.error("Error fetching work experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/work-experiences/[id] - Update a work experience
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
    const { title, description, company } = await request.json();

    if (!title || !description || !company) {
      return NextResponse.json(
        { error: "Title, description, and company are required" },
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

    if (company.length > 200) {
      return NextResponse.json(
        { error: "Company name too long (max 200 characters)" },
        { status: 400 }
      );
    }

    // Check if work experience exists
    const existingWorkExperience = await prisma.workExperience.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingWorkExperience) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    // Only allow owner to update their work experience
    if (existingWorkExperience.user.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedWorkExperience = await prisma.workExperience.update({
      where: { id },
      data: {
        title,
        description,
        company,
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

    return NextResponse.json(updatedWorkExperience);
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/work-experiences/[id] - Delete a work experience
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

    // Check if work experience exists
    const existingWorkExperience = await prisma.workExperience.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingWorkExperience) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    // Only allow owner to delete their work experience
    if (existingWorkExperience.user.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Work experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
