import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { client } = createClient(request);
    const { error } = await client.auth.signOut();

    if (error) throw error;

    return NextResponse.json({ errorMessage: null });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
