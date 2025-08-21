import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { errorMessage: "Email and password are required" },
        { status: 400 }
      );
    }

    const { client } = createClient(request);
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return NextResponse.json({ errorMessage: null });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
