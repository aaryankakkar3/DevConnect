import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyUserClearance } from "@/lib/authUtils";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verify user has dev clearance and is verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["dev"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { success: false, error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;

    const body = await request.json();
    const {
      title,
      description,
      issuingOrganization,
      startDate,
      endDate,
      proofLink,
    } = body;

    const certification = await prisma.certification.create({
      data: {
        title,
        description,
        issuingOrganization,
        startDate,
        endDate,
        proofLink,
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

export async function PUT(request: NextRequest) {
  try {
    // Verify user has dev clearance and is verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["dev"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { success: false, error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;

    const body = await request.json();
    const {
      id,
      title,
      description,
      issuingOrganization,
      startDate,
      endDate,
      proofLink,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Certification ID is required" },
        { status: 400 }
      );
    }

    // Verify the certification belongs to the authenticated user
    const existingCertification = await prisma.certification.findFirst({
      where: { id: id, userId },
    });

    if (!existingCertification) {
      return NextResponse.json(
        { success: false, error: "Certification not found or access denied" },
        { status: 404 }
      );
    }

    const updatedCertification = await prisma.certification.update({
      where: { id: id },
      data: {
        title,
        description,
        issuingOrganization,
        startDate,
        endDate,
        proofLink,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedCertification,
        message: "Certification updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating certification:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update certification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user has dev clearance and is verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["dev"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { success: false, error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Certification ID is required" },
        { status: 400 }
      );
    }

    // Verify the certification belongs to the authenticated user
    const existingCertification = await prisma.certification.findFirst({
      where: { id: id, userId },
    });

    if (!existingCertification) {
      return NextResponse.json(
        { success: false, error: "Certification not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.certification.delete({
      where: { id: id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Certification deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting certification:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete certification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
