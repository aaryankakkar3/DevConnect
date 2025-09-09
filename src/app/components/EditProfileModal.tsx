import React from "react";

function EditProfileModal() {
  const demoData = {
    name: "Aaryan Kakkar",
    email: "aaryan.kakkar@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    gender: "man",
    dob: "2000-01-01",
    skills: "javascript,node,react,html,css",
    bio: "Passionate developer with 5 years of experience in building web applications.",
  };
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bgdark opacity-30 transition-opacity" />
      <form className="relative z-20 w-175 h-fit bg-bgdark border border-bglight flex flex-col p-10 gap-8">
        <h2 className="text-l">
          <span className="text-accent">Edit </span>
          Profile
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {/* Content */}
          <label className="flex flex-col gap-2 w-full">
            Name
            <div className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0">
              {demoData.name}
            </div>
          </label>
          <label className="flex flex-col gap-2 w-full">
            Email
            <div className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0">
              {demoData.email}
            </div>
          </label>
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <button
            type="button"
            className="cursor-pointer px-8 py-4 bg-accent w-fit text-bgdark font-semibold hover:opacity-75 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            className="cursor-pointer px-8 py-4 bg-[#C32222] w-fit text-white font-semibold hover:opacity-75"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileModal;
