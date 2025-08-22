import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { prisma } from "@/db/prismaClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newEmail } = body;

    if (!newEmail) {
      return NextResponse.json(
        { errorMessage: "New email is required" },
        { status: 400 }
      );
    }

    const { client } = createClient(request);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { errorMessage: "User not authenticated" },
        { status: 401 }
      );
    }

    // Check if new email is the same as current email
    if (user.email === newEmail) {
      return NextResponse.json(
        { errorMessage: "New email must be different from current email" },
        { status: 400 }
      );
    }

    // Update email in Supabase Auth
    const { error } = await client.auth.updateUser({
      email: newEmail,
    });

    if (error) throw error;

    // Update email in database
    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    return NextResponse.json({
      errorMessage: null,
      message: "Email change confirmation sent to new email address",
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
