import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// For API routes
export function createClient(request: NextRequest, response?: NextResponse) {
  const res = response || NextResponse.next();

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Support for Authorization header (Postman testing)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    client.auth.setSession({
      access_token: token,
      refresh_token: "", // Not needed for most operations
    });
  }

  return { client, response: res };
}
