import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";

export async function POST(request: NextRequest) {
  try {
    const { email, phoneNumber, fullName } = await request.json();

    // Validate full name (at least two words)
    if (!fullName || fullName.trim().split(/\s+/).length < 2) {
      return NextResponse.json(
        {
          error:
            "Full name must contain at least two words (first and last name)",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    });

    if (existingEmailUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingPhoneUser = await prisma.user.findFirst({
      where: { contactNumber: phoneNumber.trim() },
      select: { id: true },
    });

    if (existingPhoneUser) {
      return NextResponse.json(
        { error: "An account with this phone number already exists" },
        { status: 400 }
      );
    }

    // If all validations pass
    return NextResponse.json(
      {
        success: true,
        message: "Validation passed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate signup data" },
      { status: 500 }
    );
  }
}
