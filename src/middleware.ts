import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process API routes (excluding specific auth routes but including current-user)
  if (!pathname.startsWith("/api/") || 
      (pathname.startsWith("/api/auth/") && !pathname.includes("/current-user"))) {
    return NextResponse.next();
  }

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
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Add user info to request headers
    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-email", userEmail || "");
    response.headers.set("x-user-clearance", "dev");

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
