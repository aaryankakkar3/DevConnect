import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/certifications - Get certifications with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    const certifications = await prisma.certification.findMany({
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

    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/certifications - Create a new certification
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

    const { title, description, proofUrl } = await request.json();

    if (!title || !description || !proofUrl) {
      return NextResponse.json(
        { error: "Title, description, and proofUrl are required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title too long (max 200 characters)" },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { error: "Description too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    if (proofUrl.length > 500) {
      return NextResponse.json(
        { error: "ProofUrl too long (max 500 characters)" },
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

    const certification = await prisma.certification.create({
      data: {
        title,
        description,
        proofUrl,
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

    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
