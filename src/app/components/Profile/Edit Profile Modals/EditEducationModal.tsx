import React from "react";
import { toast } from "sonner";
import { X, ChevronDown } from "lucide-react";
import SingleInputField from "./SingleInputField";
import ProofImageInputField from "./ProofImageInputField";
import NewImageComponent from "./NewImageComponent";
import ExistingImageComponent from "./ExistingImageComponent";

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
      <label className="flex flex-col gap-1 w-full">
        Degree
        <div className="relative">
          <select
            className="p-5 pr-12 bg-bg1 border border-text2 rounded-xl appearance-none w-full text-text1"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
          >
            <option value="">Select Degree</option>
            <option value="highschool">High School</option>
            <option value="diploma">Diploma</option>
            <option value="bachelors">Bachelors</option>
            <option value="masters">Masters</option>
            <option value="phd">PhD</option>
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
            <ChevronDown size={20} className="text-text1" strokeWidth={1.5} />
          </div>
        </div>
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
        <ExistingImageComponent
          proofLink={formData.proofLink}
          removeExistingImage={removeExistingImage}
        />
      )}

      {/* Display selected new image */}
      {selectedImages.length > 0 && (
        <NewImageComponent
          selectedImages={selectedImages}
          removeImage={removeImage}
        />
      )}
    </>
  );
}
