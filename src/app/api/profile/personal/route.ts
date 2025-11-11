import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { clearCachedUserData } from "../../../../lib/cache";

const prisma = new PrismaClient();

import { verifyUserClearance } from "@/lib/authUtils";

export async function PUT(request: NextRequest) {
  try {
    // Verify user is authenticated and verified
    const clearanceCheck = await verifyUserClearance(
      request,
      ["dev", "client"],
      ["verified"]
    );

    if (!clearanceCheck.success) {
      return NextResponse.json(
        { error: clearanceCheck.error },
        { status: clearanceCheck.error?.includes("Unauthorized") ? 401 : 403 }
      );
    }

    const userId = clearanceCheck.userId!;
    const body = await request.json();
    const { name, bio, skills, location, dob, gender, profilePicture } = body;

    // Convert skills string to array if it's a string
    let skillsArray = skills;
    if (typeof skills === "string") {
      skillsArray = skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0);
    }

    // Convert date string to Date object if provided
    let dobDate = null;
    if (dob && dob.trim() !== "") {
      dobDate = new Date(dob);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || null,
        bio: bio || "",
        skills: skillsArray || [],
        location: location || null,
        dob: dobDate,
        gender: gender || null,
        profilePicture: profilePicture || null,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        location: true,
        dob: true,
        gender: true,
        profilePicture: true,
        username: true,
      },
    });

    // Clear cache so next request gets fresh data
    await clearCachedUserData(userId);
    console.log("Cleared cache for user:", userId, "after profile update");

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
