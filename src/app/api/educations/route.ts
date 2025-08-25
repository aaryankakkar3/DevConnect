import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/educations - Get educations with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    const educations = await prisma.education.findMany({
      where,
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
        id: "desc",
      },
    });

    return NextResponse.json(educations);
  } catch (error) {
    console.error("Error fetching educations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/educations - Create a new education
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Get the user from database to get their ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const education = await prisma.education.create({
      data: {
        degree,
        institution,
        proof,
        score,
        userId: dbUser.id,
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

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
