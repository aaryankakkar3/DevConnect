import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Username format validation
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (username.length > 15) {
      return NextResponse.json(
        { error: "Username must be 15 characters or less" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          error: "Username can only contain letters, numbers, and underscores",
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          available: false,
          error: "This username is already taken",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        available: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Failed to check username availability" },
      { status: 500 }
    );
  }
}
