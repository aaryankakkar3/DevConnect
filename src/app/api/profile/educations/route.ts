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
    const {
      degree,
      institution,
      score,
      maxScore,
      startDate,
      endDate,
      proofLink,
    } = body;

    const education = await prisma.education.create({
      data: {
        degree,
        institution,
        score,
        maxScore,
        startDate,
        endDate,
        proofLink,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: education,
        message: "Education created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating education:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create education",
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
    const {
      id,
      degree,
      institution,
      score,
      maxScore,
      startDate,
      endDate,
      proofLink,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Education ID is required" },
        { status: 400 }
      );
    }

    // Verify the education belongs to the authenticated user
    const existingEducation = await prisma.education.findFirst({
      where: { id: id, userId },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { success: false, error: "Education not found or access denied" },
        { status: 404 }
      );
    }

    const updatedEducation = await prisma.education.update({
      where: { id: id },
      data: {
        degree,
        institution,
        score,
        maxScore,
        startDate,
        endDate,
        proofLink,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedEducation,
        message: "Education updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating education:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update education",
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
        { success: false, error: "Education ID is required" },
        { status: 400 }
      );
    }

    // Verify the education belongs to the authenticated user
    const existingEducation = await prisma.education.findFirst({
      where: { id: id, userId },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { success: false, error: "Education not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.education.delete({
      where: { id: id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Education deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting education:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete education",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
