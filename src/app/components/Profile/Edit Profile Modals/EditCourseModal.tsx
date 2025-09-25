import React from "react";
import { X } from "lucide-react";
import SingleInputField from "./SingleInputField";
import DescriptionInput from "./DescriptionInput";
import ProofImageInputField from "./ProofImageInputField";
import ExistingImageComponent from "./ExistingImageComponent";
import NewImageComponent from "./NewImageComponent";

export default function EditCourseModal({
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
  const removeImage = () => {
    setSelectedImages([]);
  };

  const removeExistingImage = () => {
    setFormData({ ...formData, proofLink: "" });
  };

  return (
    <>
      <SingleInputField
        label="Title"
        value={formData.title}
        type="text"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <SingleInputField
        label="Granting Organization"
        value={formData.issuingOrganization}
        type="text"
        onChange={(e) =>
          setFormData({ ...formData, issuingOrganization: e.target.value })
        }
      />
      <DescriptionInput
        value={formData.description}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
          // Auto-resize textarea
          e.target.style.height = "auto";
          e.target.style.height = Math.max(59, e.target.scrollHeight) + "px";
        }}
      />
      <div className="flex flex-row gap-4">
        <SingleInputField
          label="Start Date"
          value={formData.startDate}
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <SingleInputField
          label="End Date"
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
