"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useComponentRouteProtection } from "../hooks/useComponentRouteProtection";
import { useCurrentUser } from "../hooks/useCurrentUser";

function page() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const {
    user,
    loading: pageLoading,
    shouldShowContent,
  } = useComponentRouteProtection({
    requireAuth: true,
    redirectTo: "/login",
  });

  React.useEffect(() => {
    if (currentUser?.username && shouldShowContent && !pageLoading) {
      router.push(`/profile/${currentUser.username}`);
    }
  }, [router, currentUser?.username, shouldShowContent, pageLoading]);

  // Show blank screen while checking authentication
  if (pageLoading) {
    return <div></div>;
  }

  // Don't show content if user shouldn't see this page
  if (!shouldShowContent) {
    return <div></div>;
  }

  return <div></div>;
}

export default page;
