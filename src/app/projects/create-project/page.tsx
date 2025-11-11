"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import SingleInputField from "../../components/Profile/Edit Profile Modals/SingleInputField";
import DescriptionInput from "../../components/Profile/Edit Profile Modals/DescriptionInput";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/Project/ConfirmationModal";

function page() {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    longDescription: "",
    shortDescription: "",
    budget: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    if (!formData.shortDescription.trim()) {
      toast.error("Please enter a short description");
      return;
    }

    if (!formData.longDescription.trim()) {
      toast.error("Please enter a long description");
      return;
    }

    if (!formData.budget.trim()) {
      toast.error("Please enter a budget");
      return;
    }

    if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    if (!formData.skills.trim()) {
      toast.error("Please enter required skills");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/projects/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title.trim(),
          shortDescription: formData.shortDescription.trim(),
          longDescription: formData.longDescription.trim(),
          budget: Number(formData.budget),
          skills: formData.skills.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create project");
        return;
      }

      toast.success("Project created successfully!");

      // Reload page to update token count
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An error occurred while creating the project");
    } finally {
      setLoading(false);
      setIsConfirmationModalOpen(false);
    }
  };

  return (
    <ProtectedRoute
      requireAuth={true}
      requiredClearance={["client"]}
      requiredVerification={["verified"]}
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
              onClick={() => setIsConfirmationModalOpen(true)}
              disabled={loading}
              className="cursor-pointer px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                router.push("/projects/my-projects");
              }}
              className="cursor-pointer px-6 py-3 rounded-xl bg-[#C32222] w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
        {isConfirmationModalOpen && (
          <ConfirmationModal
            type="project"
            onSubmit={handleSubmit}
            onClose={() => setIsConfirmationModalOpen(false)}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default page;
