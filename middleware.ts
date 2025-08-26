import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/api/auth/client/login",
  "/api/auth/client/signup",
  "/api/auth/client/google",
  "/api/auth/dev/login",
  "/api/auth/dev/signup",
  "/api/auth/dev/google",
  "/api/auth/callback",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Only apply authentication to API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Create Supabase client for authentication
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Support for Authorization header (for API testing with Postman, etc.)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: "",
    });
  }

  // Get authenticated user from Supabase
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // If no user is authenticated, return 401
  if (authError || !user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Get user's clearance level from database
  let userRecord;
  try {
    userRecord = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        id: true,
        email: true,
        clearance: true,
      },
    });
  } catch (error) {
    console.error("Database error in middleware:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  if (!userRecord) {
    return NextResponse.json(
      { error: "User not found in database" },
      { status: 404 }
    );
  }

  // Add user information to headers for API routes to use
  response.headers.set("x-user-id", userRecord.id);
  response.headers.set("x-user-email", userRecord.email);
  response.headers.set("x-user-clearance", userRecord.clearance);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
