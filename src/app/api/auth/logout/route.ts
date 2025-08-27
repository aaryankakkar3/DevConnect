import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { client } = createClient(request);

    // Check if user is logged in
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { errorMessage: "No active session found" },
        { status: 401 }
      );
    }

    const { error } = await client.auth.signOut();

    if (error) throw error;

    return NextResponse.json({ errorMessage: null });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
