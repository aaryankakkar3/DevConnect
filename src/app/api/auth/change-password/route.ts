import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { errorMessage: "Current password is required" },
        { status: 400 }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        { errorMessage: "New password is required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { errorMessage: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          errorMessage: "New password must be different from current password",
        },
        { status: 400 }
      );
    }

    // Use the helper function for API routes
    const { client: supabase, response } = createClient(request);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { errorMessage: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { errorMessage: "User email not found" },
        { status: 400 }
      );
    }

    // Create a temporary client to verify current password
    const tempSupabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    );

    // Verify current password with temporary client
    const { error: verifyError } = await tempSupabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json(
        { errorMessage: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Update password using the original authenticated session
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return NextResponse.json({
      errorMessage: null,
      message: "Password updated successfully",
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
