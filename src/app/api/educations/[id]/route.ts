import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/educations/[id] - Get a specific education
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const education = await prisma.education.findUnique({
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

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/educations/[id] - Update an education
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
    const { degree, institution, proof, score } = await request.json();

    if (!degree || !institution || !proof || !score) {
      return NextResponse.json(
        { error: "Degree, institution, proof, and score are required" },
        { status: 400 }
      );
    }

    const validDegrees = [
      "highschool",
      "diploma",
      "bachelors",
      "masters",
      "phd",
    ];
    if (!validDegrees.includes(degree)) {
      return NextResponse.json(
        { error: `Invalid degree. Must be one of: ${validDegrees.join(", ")}` },
        { status: 400 }
      );
    }

    if (institution.length > 200) {
      return NextResponse.json(
        { error: "Institution name too long (max 200 characters)" },
        { status: 400 }
      );
    }

    if (proof.length > 500) {
      return NextResponse.json(
        { error: "Proof URL too long (max 500 characters)" },
        { status: 400 }
      );
    }

    if (score.length > 50) {
      return NextResponse.json(
        { error: "Score too long (max 50 characters)" },
        { status: 400 }
      );
    }

    // Check if education exists
    const existingEducation = await prisma.education.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    // Only allow owner to update their education
    if (existingEducation.user.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedEducation = await prisma.education.update({
      where: { id },
      data: {
        degree,
        institution,
        proof,
        score,
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

    return NextResponse.json(updatedEducation);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/educations/[id] - Delete an education
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

    // Check if education exists
    const existingEducation = await prisma.education.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    // Only allow owner to delete their education
    if (existingEducation.user.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
