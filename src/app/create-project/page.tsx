"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SingleInputField from "../components/Profile/Edit Profile Modals/SingleInputField";
import DescriptionInput from "../components/Profile/Edit Profile Modals/DescriptionInput";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

function page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    longDescription: "",
    shortDescription: "",
    budget: "",
    skills: "",
  });

  return (
    <ProtectedRoute
      requireAuth={true}
      requiredClearance={["client"]}
      redirectTo="/profile"
    >
      <div className="flex flex-col gap-6 p-6">
        <Navbar />
        <div className="gap-4 p-6 flex flex-col w-full h-fit border border-text2 rounded-xl">
          <h1 className="text-5xl text-center">Create Project</h1>
          <SingleInputField
            type="text"
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <SingleInputField
            type="number"
            label="Budget ($)"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
          />
          <SingleInputField
            type="text"
            label="Required Skills"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />
          <DescriptionInput
            value={formData.shortDescription}
            label="Short Description"
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
          />
          <DescriptionInput
            value={formData.longDescription}
            label="Long Description"
            onChange={(e) =>
              setFormData({ ...formData, longDescription: e.target.value })
            }
          />
          <div className="flex flex-row gap-4 ml-auto">
            <button
              type="button"
              className="cursor-pointer px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                router.push("/my-projects");
              }}
              className="cursor-pointer px-6 py-3 rounded-xl bg-[#C32222] w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
