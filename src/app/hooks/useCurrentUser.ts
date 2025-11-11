"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface CurrentUser {
  username: string;
  email: string;
  id: string;
  clearance?: string;
  profilePicture?: string;
  tokenCount?: number;
  verificationStatus?: string;
}

// Client-side cache for user data (in-memory)
let clientCache: {
  user: CurrentUser | null;
  timestamp: number;
  expiry: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async (forceRefresh = false) => {
    try {
      // Check client-side cache first (unless forced refresh)
      if (!forceRefresh && clientCache && Date.now() < clientCache.expiry) {
        setCurrentUser(clientCache.user);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch from API - this will now use Redis cache on server-side
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
          clientCache = null; // Clear cache
          return;
        }
        throw new Error(`Failed to fetch current user: ${response.status}`);
      }

      const result = await response.json();
      const userData = result.user;

      // Update client-side cache
      clientCache = {
        user: userData,
        timestamp: Date.now(),
        expiry: Date.now() + CACHE_DURATION,
      };

      setCurrentUser(userData);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error("Error fetching current user:", err);
      setCurrentUser(null); // Ensure user is null on error
      setError(err instanceof Error ? err.message : "Unknown error");
      clientCache = null; // Clear cache on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Function to manually refresh user data (bypassing cache)
  const refreshUser = () => {
    fetchCurrentUser(true);
  };

  // Function to clear cache (useful when user logs out or updates profile)
  const clearCache = () => {
    clientCache = null;
  };

  // Function to handle complete logout - clears cache and Supabase session
  const logout = async () => {
    try {
      // Clear client-side cache immediately
      clearCache();
      setCurrentUser(null);

      // Create Supabase client to clear browser session
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Sign out from Supabase (clears cookies/session)
      await supabase.auth.signOut();

      // Call server-side logout to clean up server session and cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies
      });

      // Clear any additional browser storage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, ensure user state is cleared
      clearCache();
      setCurrentUser(null);

      // Clear storage even on error
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  };

  return { currentUser, loading, error, refreshUser, clearCache, logout };
}
