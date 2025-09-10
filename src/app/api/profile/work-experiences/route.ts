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
    const { title, description, company, startDate, endDate, proofLink } = body;

    const workExperience = await prisma.workExperience.create({
      data: {
        title,
        description,
        company,
        startDate,
        endDate,
        proofLink,
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
    const { id, title, description, company, startDate, endDate, proofLink } =
      body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Work experience ID is required" },
        { status: 400 }
      );
    }

    // Verify the work experience belongs to the authenticated user
    const existingWorkExperience = await prisma.workExperience.findFirst({
      where: { id: id, userId },
    });

    if (!existingWorkExperience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found or access denied" },
        { status: 404 }
      );
    }

    const updatedWorkExperience = await prisma.workExperience.update({
      where: { id: id },
      data: {
        title,
        description,
        company,
        startDate,
        endDate,
        proofLink,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedWorkExperience,
        message: "Work experience updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating work experience:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update work experience",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Work experience ID is required" },
        { status: 400 }
      );
    }

    // Verify the work experience belongs to the authenticated user
    const existingWorkExperience = await prisma.workExperience.findFirst({
      where: { id: id, userId },
    });

    if (!existingWorkExperience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.workExperience.delete({
      where: { id: id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Work experience deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting work experience:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete work experience",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
