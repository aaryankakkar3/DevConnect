"use client";

import React from "react";
import ProfileAccountNav from "../components/ProfileAccountNav";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import ChangeSettingsModal from "../components/Account/ChangeSettingsModal";
import ProtectedRoute from "../components/ProtectedRoute";

function page() {
  const [modalSettings, setModalSettings] = useState<{
    type: "email" | "password" | undefined;
    isOpen: boolean;
  }>({
    type: undefined,
    isOpen: false,
  });
  const { currentUser, refreshUser } = useCurrentUser();

  // Refresh user data when user returns to the page (helpful after email confirmation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh user data
        refreshUser();
      }
    };

    const handleFocus = () => {
      refreshUser();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshUser]);

  return (
    <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
      <div>
        <div className="p-6 flex flex-col gap-6">
          <Navbar />
          <div className="flex flex-col gap-6 items-left">
            <div className="flex items-center justify-center w-full">
              <ProfileAccountNav currentPage="Account Settings" />
            </div>
            <div className="h-fit flex flex-col gap-4 w-fit">
              <div className="flex flex-row gap-2 w-120">
                <div className="flex flex-col gap-1 p-5 bg-bg2 rounded-xl cursor-pointer w-full">
                  <p className="text-text2">Email</p>
                  <p className="">{currentUser?.email}</p>
                </div>
                <button
                  className="flex items-center justify-center bg-accent2 text-text1 px-10 py-5 rounded-xl hover:font-semibold hover:opacity-70 cursor-pointer"
                  onClick={() =>
                    setModalSettings({ type: "email", isOpen: true })
                  }
                >
                  Change
                </button>
              </div>
              <div className="flex flex-row gap-2 w-120">
                <div className="flex flex-col gap-1 p-5 bg-bg2 rounded-xl w-full cursor-pointer">
                  <p className="text-text2">Password</p>
                  <p className="">*************************</p>
                </div>
                <button
                  className="flex items-center justify-center bg-accent2 text-text1 px-10 py-5 rounded-xl hover:font-semibold hover:opacity-70 cursor-pointer"
                  onClick={() =>
                    setModalSettings({ type: "password", isOpen: true })
                  }
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
        {modalSettings.isOpen && (
          <ChangeSettingsModal
            type={modalSettings.type}
            onClose={() => setModalSettings({ type: undefined, isOpen: false })}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default page;
