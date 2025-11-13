import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { validateLoginForm } from "@/lib/validation";
import { prisma } from "@/db/prismaClient";
import { Clearance } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { client, response } = createClient(request, NextResponse.next());

    const body = await request.json();
    const { email, principal, password } = body;

    // Accept either email directly or principal (which should be email for now)
    const userEmail = email || principal;

    // Validate required fields
    if (!userEmail || !password) {
      return NextResponse.json(
        { errorMessage: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return NextResponse.json(
        { errorMessage: "Please enter a valid email address" },
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

    // Check if user has admin clearance
    if (dbUser.clearance !== Clearance.admin) {
      // Sign out the user since they don't have admin access
      await client.auth.signOut();

      return NextResponse.json(
        {
          errorMessage: "Access denied. Admin privileges required.",
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
