import React from "react";
import Navbar from "../components/Navbar";
import ProfileSection from "../components/ProfileSection";

function Profile() {
  return (
    <div className="p-10 flex flex-col gap-10">
      <Navbar />
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-row gap-3 bg-bglight text-s w-fit h-fit rounded-full">
          <button className="px-20 py-10 rounded-full bg-accent text-bgdark font-semibold">
            Personal Profile
          </button>
          <button className="px-20 py-10 rounded-full hover:bg-accent hover:text-bgdark hover:font-semibold">
            Account Settings
          </button>
        </div>
        <ProfileSection type="Projects" />
        <ProfileSection type="Work Experience" />
        <ProfileSection type="Education" />
        <ProfileSection type="Certifications / Courses" />
        <ProfileSection type="Reviews" />
      </div>
    </div>
  );
}

export default Profile;
