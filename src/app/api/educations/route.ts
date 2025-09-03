import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
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
    const {
      degree,
      institution,
      proofLink,
      score,
      maxScore,
      startDate,
      endDate,
    } = body;

    // Create the education entry
    const education = await prisma.education.create({
      data: {
        degree,
        institution,
        proofLink,
        score,
        maxScore,
        startDate,
        endDate,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: education,
        message: "Education entry created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating education entry:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create education entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
