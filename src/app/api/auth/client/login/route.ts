import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { client, response } = createClient(request, NextResponse.next());

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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { errorMessage: "Email and password are required" },
        { status: 400 }
      );
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

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
