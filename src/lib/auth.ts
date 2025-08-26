import { NextRequest } from "next/server";
import { Clearance } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  email: string;
  clearance: Clearance;
}

/**
 * Get authenticated user info from middleware headers
 * Call this in your API routes to get the current user
 */
export function getUserFromHeaders(
  request: NextRequest
): AuthenticatedUser | null {
  const id = request.headers.get("x-user-id");
  const email = request.headers.get("x-user-email");
  const clearance = request.headers.get("x-user-clearance") as Clearance;

  if (!id || !email || !clearance) {
    return null;
  }

  return { id, email, clearance };
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.clearance === "admin";
}

/**
 * Check if user is a developer
 */
export function isDeveloper(user: AuthenticatedUser): boolean {
  return user.clearance === "dev";
}

/**
 * Check if user is a client
 */
export function isClient(user: AuthenticatedUser): boolean {
  return user.clearance === "client";
}
