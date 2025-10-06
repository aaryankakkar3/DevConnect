import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { client } = createClient(request);

    // Always attempt to sign out, regardless of current session state
    // This ensures we clear any existing session/cookies
    const { error } = await client.auth.signOut();

    // Create response with success
    const response = NextResponse.json({ errorMessage: null });

    // Explicitly clear all Supabase auth cookies
    const cookieNames = [
      "sb-eyrhfxzszwpdwwtztjch-auth-token",
      "sb-fvufpmynsbgaltxlsrpf-auth-token",
      "sb-eyrhfxzszwpdwwtztjch-auth-token-code-verifier",
      "sb-fvufpmynsbgaltxlsrpf-auth-token-code-verifier",
    ];

    cookieNames.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0), // Set expiry to past date
        path: "/",
      });
    });

    return response;
  } catch (error) {
    // Even if logout fails, we return success and clear cookies
    console.log("Logout error (non-critical):", error);

    const response = NextResponse.json({ errorMessage: null });

    // Still clear cookies even on error
    const cookieNames = [
      "sb-eyrhfxzszwpdwwtztjch-auth-token",
      "sb-fvufpmynsbgaltxlsrpf-auth-token",
      "sb-eyrhfxzszwpdwwtztjch-auth-token-code-verifier",
      "sb-fvufpmynsbgaltxlsrpf-auth-token-code-verifier",
    ];

    cookieNames.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      });
    });

    return response;
  }
}
