import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../db/prismaClient";
import { getCachedUserData, setCachedUserData } from "../../../../lib/cache";

export async function GET(request: NextRequest) {
  try {
    // Get basic user info from middleware headers
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to get additional user data from Redis cache first
    const cachedData = await getCachedUserData(userId);

    if (cachedData) {
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email: userEmail,
          username: cachedData.username,
          clearance: cachedData.clearance,
          profilePicture: cachedData.profilePicture,
          tokenCount: cachedData.tokenCount || 0,
          verificationStatus: cachedData.verificationStatus || "unverified",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        clearance: true,
        profilePicture: true,
        bidTokenCount: true,
        projectTokenCount: true,
        verificationStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine token count based on clearance
    const tokenCount =
      user.clearance === "dev" ? user.bidTokenCount : user.projectTokenCount;

    // Update cache with fetched data
    const cacheData = {
      username: user.username || "",
      clearance: user.clearance || "",
      profilePicture: user.profilePicture || "",
      tokenCount: tokenCount,
      verificationStatus: user.verificationStatus || "unverified",
    };

    await setCachedUserData(userId, cacheData);
    console.log("💾 Cached data for user:", userId, "Data:", cacheData);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
        username: user.username,
        clearance: user.clearance,
        profilePicture: user.profilePicture,
        tokenCount: tokenCount,
        verificationStatus: user.verificationStatus,
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
