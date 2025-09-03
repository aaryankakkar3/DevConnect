import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

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
