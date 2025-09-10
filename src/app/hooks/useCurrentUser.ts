"use client";

import { useState, useEffect } from "react";

interface CurrentUser {
  username: string;
  email: string;
  id: string;
  clearance?: string;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/current-user", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }

        const result = await response.json();
        setCurrentUser(result.user);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading, error };
}
