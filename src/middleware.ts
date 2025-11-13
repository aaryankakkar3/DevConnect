import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-API routes and webhooks only
  if (!pathname.startsWith("/api/") || pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }

  // Guest-only routes (should reject authenticated users)
  const isGuestOnlyRoute =
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/adminLogin" ||
    pathname === "/api/auth/signup" ||
    pathname === "/api/auth/check-username" ||
    pathname === "/api/auth/validate-signup";

  try {
    // Extract user ID from Supabase auth token cookie
    // Try the correct auth token cookie first
    let authTokenCookie = request.cookies.get(
      "sb-eyrhfxzszwpdwwtztjch-auth-token"
    );

    if (!authTokenCookie) {
      // Fallback to the other auth token cookie
      authTokenCookie = request.cookies.get(
        "sb-fvufpmynsbgaltxlsrpf-auth-token"
      );
    }

    if (!authTokenCookie) {
      // For guest-only routes, this is fine - continue
      if (isGuestOnlyRoute) {
        return NextResponse.next();
      }
      // For protected routes, return 401
      return NextResponse.json(
        { error: "Unauthorized - No auth token" },
        { status: 401 }
      );
    }

    // Decode the base64 auth token
    const authData = JSON.parse(
      atob(authTokenCookie.value.replace("base64-", ""))
    );
    const userId = authData.user?.id;
    const userEmail = authData.user?.email;

    if (!userId) {
      // For guest-only routes, this is fine - continue
      if (isGuestOnlyRoute) {
        return NextResponse.next();
      }
      // For protected routes, return 401
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // User is authenticated
    if (isGuestOnlyRoute) {
      // Block authenticated users from guest-only routes
      return NextResponse.json(
        { errorMessage: "User is already logged in" },
        { status: 400 }
      );
    }

    // Add basic user info to request headers (Redis will handle additional data)
    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-email", userEmail || "");

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    // For guest-only routes, continue on error (assume not logged in)
    if (isGuestOnlyRoute) {
      return NextResponse.next();
    }
    // For protected routes, return 500
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
