import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";

/**
 * Verifies that the authenticated user has the required clearance level
 * @param request - The Next.js request object with user headers from middleware
 * @param requiredClearance - Array of acceptable clearance levels (e.g., ['client'] or ['dev', 'admin'])
 * @returns Object with verification result and user info
 */
export async function verifyUserClearance(
  request: NextRequest,
  requiredClearance: string[]
): Promise<{
  success: boolean;
  userId?: string;
  userClearance?: string;
  error?: string;
}> {
  try {
    // Get user ID from middleware headers
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized - No user ID found",
      };
    }

    // Query database for user's current clearance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        clearance: true,
        id: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if user's clearance matches required level
    if (!user.clearance || !requiredClearance.includes(user.clearance)) {
      return {
        success: false,
        error: `Access denied - requires ${requiredClearance.join(
          " or "
        )} clearance, but user has ${user.clearance || "no"} clearance`,
      };
    }

    // Success - user has required clearance
    return {
      success: true,
      userId: user.id,
      userClearance: user.clearance,
    };
  } catch (error) {
    console.error("Error verifying user clearance:", error);
    return {
      success: false,
      error: "Database error during clearance verification",
    };
  }
}

/**
 * Convenience function that throws an error if clearance check fails
 * Use this when you want to handle failures with try/catch
 */
export async function requireUserClearance(
  request: NextRequest,
  requiredClearance: string[]
): Promise<{ userId: string; userClearance: string }> {
  const result = await verifyUserClearance(request, requiredClearance);

  if (!result.success) {
    throw new Error(result.error || "Clearance verification failed");
  }

  return {
    userId: result.userId!,
    userClearance: result.userClearance!,
  };
}

/**
 * Express-style middleware wrapper for API routes
 * Returns a NextResponse with error if clearance check fails
 */
export async function withClearanceCheck(
  request: NextRequest,
  requiredClearance: string[],
  handler: (
    request: NextRequest,
    userId: string,
    userClearance: string
  ) => Promise<NextResponse>
): Promise<NextResponse> {
  const result = await verifyUserClearance(request, requiredClearance);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error?.includes("Unauthorized") ? 401 : 403 }
    );
  }

  return handler(request, result.userId!, result.userClearance!);
}
