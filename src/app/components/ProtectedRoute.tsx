"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";

type RouteProtectionOptions = {
  requireAuth?: boolean;
  requireGuest?: boolean;
  requiredClearance?: string[];
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
};

interface ProtectedRouteProps extends RouteProtectionOptions {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  loadingComponent,
  requireAuth = false,
  requireGuest = false,
  requiredClearance = [],
  redirectTo,
}: ProtectedRouteProps) {
  const { currentUser: user, loading: userLoading } = useCurrentUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (userLoading || isRedirecting) return; // Wait for user data to load

    // Check if authentication is required but user is not logged in
    if (requireAuth && !user) {
      setIsRedirecting(true);
      router.push(redirectTo || "/login");
      return;
    }

    // Check if page is for guests only (login/signup) but user is logged in
    if (requireGuest && user) {
      setIsRedirecting(true);
      router.push(redirectTo || "/profile");
      return;
    }

    // Check clearance requirements
    if (user && requiredClearance.length > 0) {
      const userClearance = user.clearance?.toLowerCase();

      const hasRequiredClearance = requiredClearance.some(
        (clearance) => clearance.toLowerCase() === userClearance
      );

      if (!hasRequiredClearance) {
        setIsRedirecting(true);
        router.push(redirectTo || "/");
        return;
      }
    }
  }, [
    user,
    userLoading,
    requireAuth,
    requireGuest,
    requiredClearance,
    redirectTo,
    router,
    isRedirecting,
  ]);

  // Return loading state while checking authentication
  const isLoading = userLoading || isRedirecting;
  const shouldShowContent =
    !isLoading &&
    ((!requireAuth && !requireGuest) || // Public page
      (requireAuth && user) || // Protected page with user
      (requireGuest && !user) || // Guest page without user
      (requiredClearance.length > 0 &&
        user &&
        requiredClearance.some(
          (c) => c.toLowerCase() === user.clearance?.toLowerCase()
        ))); // Role-based page with correct clearance

  // Show loading screen while checking authentication
  if (isLoading) {
    return loadingComponent || <div></div>;
  }

  // Don't show content if user shouldn't see this page
  if (!shouldShowContent) {
    return <div></div>;
  }

  // Render children with access to user data via context if needed
  return <>{children}</>;
}
