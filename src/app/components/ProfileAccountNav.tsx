"use client";

import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

function ProfileAccountNav({ currentPage }: { currentPage: string }) {
  const { currentUser } = useCurrentUser();
  const profileLink = `profile/${currentUser?.username}`;

  return (
    <div className="flex flex-row gap-3 border border-text2 text-base w-fit h-fit rounded-xl">
      <button
        className={`px-12 py-3 rounded-xl hover:font-semibold cursor-pointer ${
          currentPage === "Personal Profile"
            ? "bg-accent text-bg1"
            : "hover:bg-bg2"
        }`}
        onClick={() => (window.location.href = profileLink)}
      >
        Personal Profile
      </button>
      <button
        className={`px-12 py-3 rounded-xl hover:font-semibold cursor-pointer ${
          currentPage === "Account Settings"
            ? "bg-accent text-bg1"
            : "hover:bg-bg2"
        }`}
        onClick={() => (window.location.href = "/account")}
      >
        Account Settings
      </button>
    </div>
  );
}

export default ProfileAccountNav;
