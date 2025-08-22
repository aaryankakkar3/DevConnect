import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../../db/authServer.ts";

const prisma = new PrismaClient();

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const requestData = await request.json();

    // Define allowed fields for user updates

    const allowedFields = [
      "name",
      "profilePicture",
      "selfieCheckPhoto",
      "idPhoto",
      "dob",
      "gender",
      "location",
      "skills",
    ];

    // Check if any forbidden fields are being updated
    const requestFields = Object.keys(requestData);
    const forbiddenFields = requestFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (forbiddenFields.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot update fields: ${forbiddenFields.join(
            ", "
          )}. Only allowed fields: ${allowedFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Only include allowed fields in update data
    const updateData: any = {};
    allowedFields.forEach((field) => {
      if (requestData.hasOwnProperty(field)) {
        if (field === "skills") {
          // Accept comma-separated string, trim and split
          if (typeof requestData.skills === "string") {
            updateData.skills = requestData.skills
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);
          }
        } else {
          updateData[field] = requestData[field];
        }
      }
    });

    // Check if user exists and user owns this record or is authorized
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow users to update their own profile (or add admin logic later)
    if (existingUser.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        clearance: true,
        profilePicture: true,
        selfieCheckPhoto: true,
        idPhoto: true,
        dob: true,
        gender: true,
        location: true,
        skills: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow users to delete their own profile
    if (existingUser.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
