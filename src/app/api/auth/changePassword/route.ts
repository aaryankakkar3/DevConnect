import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user info from middleware headers
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { errorMessage: "You must be logged in to change your password" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    // Validate required fields
    if (!newPassword) {
      return NextResponse.json(
        { errorMessage: "New password is required" },
        { status: 400 }
      );
    }

    // Validate password requirements
    const minLength = newPassword.length >= 8;
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!minLength) {
      return NextResponse.json(
        { errorMessage: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (!hasLowercase) {
      return NextResponse.json(
        { errorMessage: "Password must contain at least one lowercase letter" },
        { status: 400 }
      );
    }

    if (!hasUppercase) {
      return NextResponse.json(
        { errorMessage: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    if (!hasDigit) {
      return NextResponse.json(
        { errorMessage: "Password must contain at least one digit" },
        { status: 400 }
      );
    }

    if (!hasSymbol) {
      return NextResponse.json(
        { errorMessage: "Password must contain at least one symbol" },
        { status: 400 }
      );
    }

    // Create Supabase client and update password
    const { client } = createClient(request, NextResponse.next());
    const { error: updateError } = await client.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { errorMessage: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Password updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return handleError(error);
  }
}
