"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { useCurrentUser } from "../hooks/useCurrentUser";

function page() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  React.useEffect(() => {
    if (currentUser?.username) {
      router.push(`/profile/${currentUser.username}`);
    }
  }, [router, currentUser?.username]);

  return (
    <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
      <div></div>
    </ProtectedRoute>
  );
}

export default page;
