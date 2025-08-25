import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/bids - Get all bids with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const bidderId = searchParams.get("bidderId");

    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (bidderId) {
      where.bidderId = bidderId;
    }

    const bids = await prisma.bid.findMany({
      where,
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            skills: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
            skills: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/bids - Create a new bid
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

    const { projectId, price, details, time } = await request.json();

    if (!projectId || !price || !details || !time) {
      return NextResponse.json(
        { error: "ProjectId, price, details, and time are required" },
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

    // Check if project exists and is open
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.status !== "open") {
      return NextResponse.json(
        { error: "Project is not accepting bids" },
        { status: 400 }
      );
    }

    // Check if user is trying to bid on their own project
    if (project.creatorId === dbUser.id) {
      return NextResponse.json(
        { error: "Cannot bid on your own project" },
        { status: 400 }
      );
    }

    const bid = await prisma.bid.create({
      data: {
        projectId,
        bidderId: dbUser.id,
        price: parseInt(price),
        details,
        time: parseInt(time),
      },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            skills: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
          },
        },
      },
    });

    return NextResponse.json(bid, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bid:", error);
    // Handle unique constraint violation (duplicate bid)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You have already bid on this project" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
