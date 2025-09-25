import React from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import SingleInputField from "./SingleInputField";
import DescriptionInput from "./DescriptionInput";
import ProofImageInputField from "./ProofImageInputField";
import ExistingImageComponent from "./ExistingImageComponent";
import NewImageComponent from "./NewImageComponent";

export default function EditWorkModal({
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
      <SingleInputField
        label="Position"
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <SingleInputField
        label="Company Name"
        type="text"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
          type="text"
          label="From"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />

        <SingleInputField
          label="To"
          type="text"
          value={formData.endDate}
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
