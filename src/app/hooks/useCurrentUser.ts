"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface CurrentUser {
  username: string;
  email: string;
  id: string;
  clearance?: string;
  profilePicture?: string;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      // The API call now gets user data from middleware headers (no database call needed!)
      const response = await fetch("/api/auth/current-user", {
        credentials: "include",
      });

      if (!response.ok) {
        // Handle authentication and user not found errors gracefully
        if (
          response.status === 401 ||
          response.status === 403 ||
          response.status === 404
        ) {
          // User is not authenticated or not found in database - this is expected, not an error
          setCurrentUser(null);
          setError(null);
          return;
        }
        throw new Error(`Failed to fetch current user: ${response.status}`);
      }

      const result = await response.json();
      setCurrentUser(result.user);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error("Error fetching current user:", err);
      setCurrentUser(null); // Ensure user is null on error
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Function to manually refresh user data
  const refreshUser = () => {
    fetchCurrentUser();
  };

  return { currentUser, loading, error, refreshUser };
}
