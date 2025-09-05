import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { prisma } from "@/db/prismaClient";
import { validateSignupForm } from "@/lib/validation";
import { Clearance } from "@prisma/client";

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
    const {
      email,
      password,
      fullName,
      contactNumber,
      confirmPassword,
      isClient,
    } = body;

    // Validate all required fields are present
    if (
      !email ||
      !password ||
      !fullName ||
      !contactNumber ||
      !confirmPassword ||
      typeof isClient !== "boolean"
    ) {
      return NextResponse.json(
        { errorMessage: "All fields are required" },
        { status: 400 }
      );
    }

    let clearance: Clearance;
    if (isClient) {
      clearance = Clearance.client;
    } else {
      clearance = Clearance.dev;
    }

    // Validate form data using shared validation logic
    const validation = validateSignupForm({
      fullName,
      email,
      contactNumber,
      password,
      confirmPassword,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { errorMessage: "Validation failed", errors: validation.errors },
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
        name: fullName,
        contactNumber,
        clearance: clearance,
        username: "kakkaraaryan",
      },
    });

    return NextResponse.json({ errorMessage: null });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
