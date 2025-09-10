import React, { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/uploadImage";

function EditProfileModal({
  onClose,
  profileData,
  setProfileData,
  isThisADevProfile,
}: {
  onClose: () => void;
  profileData: any;
  setProfileData: (data: any) => void;
  isThisADevProfile: boolean;
}) {
  const [formData, setFormData] = useState({
    name: profileData.name || "",
    location: profileData.location || "",
    gender: profileData.gender || "",
    dob: profileData.dob || "",
    skills: profileData.skills || "",
    bio: profileData.bio || "",
    profilePicture: profileData.profilePicture || "",
  });
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let updatedFormData = { ...formData };

      // Upload new profile image if one is selected
      if (selectedProfileImage) {
        toast.success("Uploading profile picture...");
        const uploadedImageUrl = await uploadImageToCloudinary(
          selectedProfileImage
        );
        updatedFormData.profilePicture = uploadedImageUrl;
        toast.success("Profile picture uploaded successfully!");
      }

      // Save to database via API
      const response = await fetch("/api/profile/personal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      // Update the local profile data with the response from the database
      setProfileData(result.data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0]; // Only take the first file

    // Validate file type
    const isValidType = file.type.startsWith("image/");
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

    if (!isValidType) {
      toast.error(`${file.name} is not a valid image file`);
      return;
    }
    if (!isValidSize) {
      toast.error(`${file.name} is too large (max 10MB)`);
      return;
    }

    setSelectedProfileImage(file); // Replace any existing selection
  };

  const removeProfileImage = () => {
    setSelectedProfileImage(null);
  };

  const removeExistingProfileImage = () => {
    setFormData({ ...formData, profilePicture: "" });
  };
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bgdark opacity-30 transition-opacity" />
      <form className="relative z-20 w-175 max-h-[90vh] overflow-y-auto bg-bgdark border border-bglight flex flex-col p-10 gap-8">
        <h2 className="text-l">
          <span className="text-accent">Edit </span>
          Profile
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {/* Content */}
          <label className="flex flex-col gap-2 w-full">
            Name
            <div className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0">
              {formData.name}
            </div>
          </label>
          <label className="flex flex-col gap-2 w-full">
            Date of Birth
            <div className="py-4 px-8 h-[51px] bg-bglight focus:outline-none focus:ring-0">
              {formData.dob ? new Date(formData.dob).toLocaleDateString() : ""}
            </div>
          </label>

          <label className="flex flex-col gap-2 w-full">
            Profile Picture
            <div className="py-[15px] px-8 bg-bglight focus:outline-none focus:ring-0 flex justify-end">
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleProfileImageSelect}
                className="hidden"
              />
              <label
                htmlFor="profile-image-upload"
                className="px-[2px] py-[1px] border border-muted w-fit cursor-pointer hover:bg-muted hover:text-bgdark transition-colors"
              >
                Choose Image
              </label>
            </div>
          </label>

          {/* Display existing profile image (for edit mode) */}
          {formData.profilePicture && formData.profilePicture.trim() !== "" && (
            <div className="flex flex-col gap-2 w-full">
              <span className="">Existing Profile Picture:</span>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-bglight p-2 rounded">
                  <span className="text-s truncate max-w-40">
                    {formData.profilePicture.split("/").pop()?.split("?")[0] ||
                      "Image"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExistingProfileImage()}
                    className="text-muted2 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display selected new profile image */}
          {selectedProfileImage && (
            <div className="flex flex-col gap-2 w-full">
              <span className="">New Profile Picture to Upload:</span>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-bglight p-2 rounded">
                  <span className="text-s truncate max-w-40">
                    {selectedProfileImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProfileImage()}
                    className="text-muted2 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
          <label className="flex flex-col gap-2 w-full">
            Bio
            <textarea
              className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0 resize-none min-h-[59px]"
              value={formData.bio}
              onChange={(e) => {
                setFormData({ ...formData, bio: e.target.value });
                // Auto-resize textarea
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.max(59, e.target.scrollHeight) + "px";
              }}
              onInput={(e) => {
                // Also handle onInput for better responsiveness
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.max(59, target.scrollHeight) + "px";
              }}
              style={{ overflowY: "hidden" }}
              rows={1}
            />
          </label>
          {isThisADevProfile && (
            <label className="flex flex-col gap-2 w-full">
              Skills
              <input
                type="text"
                className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />
            </label>
          )}
          <label className="flex flex-col gap-2 w-full">
            Location
            <input
              type="text"
              className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-2 w-full">
            Gender
            <select
              className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="cursor-pointer px-8 py-4 bg-accent w-fit text-bgdark font-semibold hover:opacity-75 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-8 py-4 bg-[#C32222] w-fit text-white font-semibold hover:opacity-75 disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileModal;
