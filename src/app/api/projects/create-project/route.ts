import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../db/prismaClient";
import { verifyUserClearance } from "@/lib/authUtils";
import { clearCachedUserData } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    // Verify user has client clearance
    const clearanceCheck = await verifyUserClearance(request, ["client"]);

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;

    // Parse request body
    const body = await request.json();
    const { title, shortDescription, longDescription, budget, skills } = body;

    // Server-side validation
    if (!title || !shortDescription || !longDescription || !budget || !skills) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (typeof budget !== "number" || budget <= 0) {
      return NextResponse.json(
        { error: "Budget must be a positive number" },
        { status: 400 }
      );
    }

    // Parse required skills from comma-separated string
    const requiredSkills = skills
      .split(",")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);

    if (requiredSkills.length === 0) {
      return NextResponse.json(
        { error: "At least one skill is required" },
        { status: 400 }
      );
    }

    // Check if user has at least 1 project token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { projectTokenCount: true },
    });

    if (!user || user.projectTokenCount < 1) {
      return NextResponse.json(
        {
          error:
            "You don't have enough project tokens. Please purchase more tokens.",
        },
        { status: 400 }
      );
    }

    // Create the project and decrement project token count in a transaction
    const newProject = await prisma.$transaction(async (tx) => {
      // Create the project
      const project = await tx.project.create({
        data: {
          title: title.trim(),
          shortDesc: shortDescription.trim(),
          longDesc: longDescription.trim(),
          budget: budget,
          skills: requiredSkills,
          creatorId: userId,
          status: "open", // Default status
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // Decrement project token count
      await tx.user.update({
        where: { id: userId },
        data: {
          projectTokenCount: {
            decrement: 1,
          },
        },
      });

      return project;
    });

    // Clear Redis cache so next fetch gets updated token count
    await clearCachedUserData(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
