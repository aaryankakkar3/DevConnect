import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { prisma } from "@/db/prismaClient";

export async function POST(request: NextRequest) {
  try {
    const { client } = createClient(request);

    // Check if user is already logged in
    const {
      data: { user },
    } = await client.auth.getUser();
    if (user) {
      return NextResponse.json(
        { errorMessage: "User is already logged in" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { errorMessage: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Error signing up");

    await prisma.user.create({
      data: {
        id: userId,
        email,
        clearance: "dev",
      },
    });

    return NextResponse.json({ errorMessage: null });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
