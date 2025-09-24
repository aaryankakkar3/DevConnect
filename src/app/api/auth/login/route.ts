import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { validateLoginForm } from "@/lib/validation";
import { prisma } from "@/db/prismaClient";
import { Clearance } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { client, response } = createClient(request, NextResponse.next());

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
    const { email, principal, password, isClient } = body;

    // Accept either email directly or principal (which should be email for now)
    const userEmail = email || principal;

    // Validate required fields
    if (!userEmail || !password || typeof isClient !== "boolean") {
      return NextResponse.json(
        { errorMessage: "Email, password, and user type are required" },
        { status: 400 }
      );
    }

    // For now, validate that principal is an email format (since phone auth not setup)
    if (principal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(principal)) {
      return NextResponse.json(
        {
          errorMessage:
            "Please enter a valid email address. Phone number authentication is not yet available.",
        },
        { status: 400 }
      );
    }

    // Validate input using shared validation logic
    const validation = validateLoginForm({ email: userEmail, password });

    if (!validation.isValid) {
      return NextResponse.json(
        { errorMessage: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data: authData, error } = await client.auth.signInWithPassword({
      email: userEmail,
      password,
    });

    if (error) throw error;

    // Get user from database to check clearance
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { clearance: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { errorMessage: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if clearance matches what user selected
    const expectedClearance: Clearance = isClient
      ? Clearance.client
      : Clearance.dev;

    if (dbUser.clearance !== expectedClearance) {
      // Sign out the user since clearance doesn't match
      await client.auth.signOut();

      return NextResponse.json(
        {
          errorMessage: `Access denied. This account is registered as ${
            dbUser.clearance === Clearance.client ? "Client" : "Developer"
          }, but you're trying to login as ${
            isClient ? "Client" : "Developer"
          }.`,
        },
        { status: 403 }
      );
    }

    // Create a new response with the session cookies
    const successResponse = NextResponse.json({ errorMessage: null });

    // Copy cookies from the auth response
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      successResponse.headers.append("Set-Cookie", cookie);
    });

    return successResponse;
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
