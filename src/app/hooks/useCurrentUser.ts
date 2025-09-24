"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

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

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      // Create client-side Supabase client to refresh session
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Refresh session to get latest user data (including email changes)
      await supabase.auth.refreshSession();

      const response = await fetch("/api/auth/current-user", {
        credentials: "include",
      });

      if (!response.ok) {
        // Handle authentication errors gracefully
        if (response.status === 401 || response.status === 403) {
          // User is not authenticated - this is expected, not an error
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
