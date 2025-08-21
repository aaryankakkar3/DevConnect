import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/authServer.ts";
import { handleError } from "@/lib/utils";
import { prisma } from "@/db/prismaClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const type = searchParams.get("type") || "client"; // default to client

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=no_code`
      );
    }

    const { client } = createClient(request);
    const { data, error } = await client.auth.exchangeCodeForSession(code);

    if (error) throw error;

    const user = data.user;
    if (!user?.email) {
      throw new Error("No user email found");
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // If user doesn't exist, create them
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          clearance: type === "dev" ? "dev" : "client",
        },
      });
    }

    // Redirect based on user type
    const redirectUrl =
      type === "dev"
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/dev/dashboard`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login?error=auth_failed`
    );
  }
}
