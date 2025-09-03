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
      title,
      description,
      issuingOrganization,
      proofLink,
      startDate,
      endDate,
    } = body;

    // Create the certification entry
    const certification = await prisma.certification.create({
      data: {
        title,
        description,
        issuingOrganization,
        proofLink,
        startDate,
        endDate,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: certification,
        message: "Certification created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certification:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create certification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
