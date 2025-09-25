"use client";

import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRouter } from "next/navigation";

function ProfileAccountNav({ currentPage }: { currentPage: string }) {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const profileLink = `profile/${currentUser?.username}`;

  function Button({ buttonText, link }: { buttonText: string; link: string }) {
    return (
      <button
        className={`px-12 py-3 rounded-xl cursor-pointer ${
          currentPage === buttonText
            ? "bg-accent text-bg1"
            : "hover:bg-bg2 text-text1"
        }`}
        onClick={() => {
          router.push(link);
        }}
      >
        {buttonText}
      </button>
    );
  }

  return (
    <div className="flex flex-row gap-4 border border-text2 text-base w-fit h-fit rounded-xl">
      <Button buttonText="Personal Profile" link={profileLink} />
      <Button buttonText="Account Settings" link="/account" />
    </div>
  );
}

export default ProfileAccountNav;
