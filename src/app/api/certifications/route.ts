import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const {
      title,
      description,
      issuingOrganization,
      proofLink,
      startDate,
      endDate,
      userId,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let certifications;

    if (userId) {
      // Get certifications for a specific user
      certifications = await prisma.certification.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          startDate: "desc", // Most recent first
        },
      });
    } else {
      // Get all certifications
      certifications = await prisma.certification.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: certifications,
        count: certifications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching certifications:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch certifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
