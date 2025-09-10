import React from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import SingleInputField from "./SingleInputField";
import ProofImageInputField from "./ProofImageInputField";

export default function EditEducationModal({
  formData,
  setFormData,
  selectedImages,
  setSelectedImages,
}: {
  formData: any;
  setFormData: (data: any) => void;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
}) {
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedImages([file]); // Only one image
  };

  const removeImage = () => {
    setSelectedImages([]);
  };

  const removeExistingImage = () => {
    setFormData({ ...formData, proofLink: "" });
  };

  return (
    <>
      <label className="flex flex-col gap-2 w-full">
        Degree
        <select
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
        >
          <option value="">Select Degree</option>
          <option value="highschool">High School</option>
          <option value="diploma">Diploma</option>
          <option value="bachelors">Bachelors</option>
          <option value="masters">Masters</option>
          <option value="phd">PhD</option>
        </select>
      </label>
      <SingleInputField
        label="Institution"
        value={formData.institution}
        type="text"
        onChange={(e) =>
          setFormData({ ...formData, institution: e.target.value })
        }
      />
      <div className="flex flex-row gap-4">
        <SingleInputField
          label="Score"
          value={formData.score}
          type="text"
          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
        />
        <SingleInputField
          label="Max Score"
          value={formData.maxScore}
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, maxScore: e.target.value })
          }
        />
      </div>
      <div className="flex flex-row gap-4">
        <SingleInputField
          label="From"
          value={formData.startDate}
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <SingleInputField
          label="To"
          value={formData.endDate}
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
      </div>
      <ProofImageInputField setSelectedImages={setSelectedImages} />

      {/* Display existing image (for edit mode) */}
      {formData.proofLink && formData.proofLink.trim() !== "" && (
        <div className="flex flex-col gap-2 w-full">
          <span className="">Existing Image:</span>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-bglight p-2 rounded">
              <span className="text-s truncate max-w-40">
                {formData.proofLink.split("/").pop()?.split("?")[0] || "Image"}
              </span>
              <button
                type="button"
                onClick={() => removeExistingImage()}
                className="text-muted2 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display selected new image */}
      {selectedImages.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <span className="">New Image to Upload:</span>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-bglight p-2 rounded">
              <span className="text-s truncate max-w-40">
                {selectedImages[0].name}
              </span>
              <button
                type="button"
                onClick={() => removeImage()}
                className="text-muted2 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
