"use client";

import React from "react";
import ProfileAccountNav from "../components/ProfileAccountNav";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Navbar from "../components/Navbar";
import { useState } from "react";
import ChangeSettingsModal from "../components/Account/ChangeSettingsModal";

function page() {
  const [modalSettings, setModalSettings] = useState<{
    type: "email" | "password" | undefined;
    isOpen: boolean;
  }>({
    type: undefined,
    isOpen: false,
  });
  const { currentUser } = useCurrentUser();
  return (
    <div>
      <div className="p-5 flex flex-col gap-5">
        <Navbar />
        <div className="flex flex-col gap-5 items-left">
          <div className="flex items-center justify-center w-full">
            <ProfileAccountNav currentPage="Account Settings" />
          </div>
          <div className="h-fit flex flex-col gap-3 w-fit">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-1 px-12 py-3 bg-bg2 rounded-xl cursor-pointer">
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
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col gap-1 px-12 py-3 bg-bg2 rounded-xl w-full cursor-pointer">
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
  );
}

export default page;
