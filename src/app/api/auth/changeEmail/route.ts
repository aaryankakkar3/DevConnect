import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { prisma } from "@/db/prismaClient";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user info from middleware headers
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");

    if (!userId || !userEmail) {
      return NextResponse.json(
        { errorMessage: "You must be logged in to change your email" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newEmail } = body;

    // Validate required fields
    if (!newEmail) {
      return NextResponse.json(
        { errorMessage: "New email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { errorMessage: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email is the same as current
    if (userEmail === newEmail) {
      return NextResponse.json(
        { errorMessage: "New email must be different from current email" },
        { status: 400 }
      );
    }

    // Check if email already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { errorMessage: "Email is already in use" },
        { status: 400 }
      );
    }

    // Create Supabase client and update email
    const { client } = createClient(request, NextResponse.next());
    const { error: updateError } = await client.auth.updateUser({
      email: newEmail,
    });

    if (updateError) {
      return NextResponse.json(
        { errorMessage: updateError.message },
        { status: 400 }
      );
    }

    // Note: The actual database update will happen when the user confirms
    // the email change via the confirmation link sent by Supabase.
    // You may want to set up a webhook or handle this in your auth state change listener.

    return NextResponse.json(
      {
        message:
          "Email change confirmation sent. Please check your new email address.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change email error:", error);
    return handleError(error);
  }
}
