import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { client } = createClient(request);

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?type=dev`,
      },
    });

    if (error) throw error;

    return NextResponse.json({
      errorMessage: null,
      url: data.url,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
