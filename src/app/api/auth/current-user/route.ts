import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../db/prismaClient";

export async function GET(request: NextRequest) {
  try {
    // Get all user info from middleware headers (no database call needed!)
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");
    const username = request.headers.get("x-user-username");
    const clearance = request.headers.get("x-user-clearance");
    const profilePicture = request.headers.get("x-user-profile-picture");

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If middleware provided incomplete data, fallback to database
    if (!username && !clearance) {
      console.warn("Middleware headers incomplete, falling back to database");

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          username: true,
          clearance: true,
          profilePicture: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: userEmail,
          username: user.username,
          clearance: user.clearance,
          profilePicture: user.profilePicture,
        },
      });
    }

    // Use data from middleware headers (much faster!)
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
        username: username || "",
        clearance: clearance || "",
        profilePicture: profilePicture || undefined,
      },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
