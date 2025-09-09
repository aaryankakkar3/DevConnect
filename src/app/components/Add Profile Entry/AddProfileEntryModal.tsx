import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import EditProjectModal from "./EditProjectModal";
import EditWorkModal from "./EditWorkModal";
import EditEducationModal from "./EditEducationModal";
import EditCourseModal from "./EditCourseModal";

// Reusable image handling functions
const handleMultipleImageSelect = (
  event: React.ChangeEvent<HTMLInputElement>,
  selectedImages: File[],
  setSelectedImages: (files: File[]) => void
) => {
  const files = Array.from(event.target.files || []);

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(`File ${file.name} is not an image.`);
      return;
    }
  }

  setSelectedImages([...selectedImages, ...files]);
};

const removeMultipleImage = (
  index: number,
  selectedImages: File[],
  setSelectedImages: (files: File[]) => void
) => {
  const newImages = selectedImages.filter((_, i) => i !== index);
  setSelectedImages(newImages);
};

const removeExistingMultipleImage = (
  index: number,
  formData: any,
  setFormData: (data: any) => void
) => {
  const newImages = [...formData.images];
  newImages.splice(index, 1);
  setFormData({ ...formData, images: newImages });
};

const handleSingleImageSelect = (
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedImages: (files: File[]) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    toast.error("File is too large. Maximum size is 10MB.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file.");
    return;
  }

  setSelectedImages([file]);
};

const removeSingleImage = (setSelectedImages: (files: File[]) => void) => {
  setSelectedImages([]);
};
const removeExistingSingleImage = (
  formData: any,
  setFormData: (data: any) => void
) => {
  setFormData({ ...formData, proofLink: "" });
};

function AddProfileEntryModal({
  type,
  onClose,
  onSuccess,
  editData = null,
}: {
  type: string;
  onClose: () => void;
  onSuccess?: (newData: any) => void;
  editData?: any;
}) {
  const isEditMode = editData !== null;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    id: editData?.id || "",
    title: editData?.title || "",
    description: editData?.description || "",
    issuingOrganization: editData?.issuingOrganization || "",
    proofLink: editData?.proofLink || "",
    company: editData?.company || "",
    startDate: editData?.startDate || "",
    endDate: editData?.endDate || "",
    links: editData?.links || [""],
    linkLabels: editData?.linkLabels || [""],
    images: editData?.images || [],
    degree: editData?.degree || "",
    institution: editData?.institution || "",
    score: editData?.score || "",
    maxScore: editData?.maxScore || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Helper function to upload images to Cloudinary
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const imageUploadPromises = files.map(async (file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imageUploadPromises);

    const response = await fetch("/api/upload/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: base64Images }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload images");
    }

    const result = await response.json();
    return result.urls;
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("Frontend Form Data", formData);
    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast.loading(
      `${isEditMode ? "Updating" : "Adding"} ${type}...`
    );

    try {
      let uploadedImageUrls: string[] = [];

      // Upload new images if any are selected
      if (selectedImages.length > 0) {
        toast.loading("Uploading images...", { id: loadingToast });
        uploadedImageUrls = await uploadImages(selectedImages);
      }

      // Prepare data based on form type
      let endpoint = "";
      let payload = {};
      const method = isEditMode ? "PUT" : "POST";

      switch (type) {
        case "Projects":
          // Combine existing images with newly uploaded ones for projects
          const allImages = [
            ...(formData.images || []),
            ...uploadedImageUrls,
          ].filter((img) => img && img.trim() !== "");

          endpoint = `/api/profile/portfolio-projects`;
          payload = {
            ...(isEditMode && { id: formData.id }),
            title: formData.title,
            description: formData.description,
            links: formData.links.filter((link: any) => link.trim() !== ""),
            linkLabels: formData.linkLabels.filter(
              (label: any) => label.trim() !== ""
            ),
            images: allImages,
          };
          break;

        case "Work Experience":
          endpoint = `/api/profile/work-experiences`;
          payload = {
            ...(isEditMode && { id: formData.id }),
            title: formData.title,
            description: formData.description,
            company: formData.company,
            startDate: formData.startDate,
            endDate: formData.endDate,
            proofLink:
              uploadedImageUrls.length > 0
                ? uploadedImageUrls[0]
                : formData.proofLink || "",
          };
          break;

        case "Education":
          endpoint = `/api/profile/educations`;
          payload = {
            ...(isEditMode && { id: formData.id }),
            degree: formData.degree,
            institution: formData.institution,
            score: formData.score,
            maxScore: formData.maxScore,
            startDate: formData.startDate,
            endDate: formData.endDate,
            proofLink:
              uploadedImageUrls.length > 0
                ? uploadedImageUrls[0]
                : formData.proofLink || "",
          };
          break;

        case "Certifications / Courses":
          endpoint = `/api/profile/certifications`;
          payload = {
            ...(isEditMode && { id: formData.id }),
            title: formData.title,
            description: formData.description,
            issuingOrganization: formData.issuingOrganization,
            startDate: formData.startDate,
            endDate: formData.endDate,
            proofLink:
              uploadedImageUrls.length > 0
                ? uploadedImageUrls[0]
                : formData.proofLink || "",
          };
          break;

        default:
          throw new Error("Unknown form type");
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This ensures cookies are sent
        body: JSON.stringify(payload),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Error ${isEditMode ? "updating" : "adding"} ${type}: ${
            errorData.error || response.statusText
          }`
        );
        return;
      }

      const result = await response.json();
      console.log("Success:", result);
      toast.success(
        `${type} ${isEditMode ? "updated" : "added"} successfully!`
      );

      // Pass the created data to onSuccess for optimistic updates
      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      toast.error(`Error adding ${type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderModalContent = () => {
    switch (type) {
      case "Projects":
        return (
          <EditProjectModal
            formData={formData}
            setFormData={setFormData}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            handleMultipleImageSelect={handleMultipleImageSelect}
            removeMultipleImage={removeMultipleImage}
            removeExistingMultipleImage={removeExistingMultipleImage}
          />
        );
      case "Work Experience":
        return (
          <EditWorkModal
            formData={formData}
            setFormData={setFormData}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        );
      case "Education":
        return (
          <EditEducationModal
            formData={formData}
            setFormData={setFormData}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        );
      case "Certifications / Courses":
        return (
          <EditCourseModal
            formData={formData}
            setFormData={setFormData}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        );
      default:
        return (
          <EditProjectModal
            formData={formData}
            setFormData={setFormData}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            handleMultipleImageSelect={handleMultipleImageSelect}
            removeMultipleImage={removeMultipleImage}
            removeExistingMultipleImage={removeExistingMultipleImage}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bgdark opacity-30 transition-opacity" />
      <form className="relative z-20 w-175 h-fit bg-bgdark border border-bglight flex flex-col p-10 gap-8">
        <h2 className="text-l">
          <span className="text-accent">{isEditMode ? "Edit" : "Add"} </span>
          {type}
        </h2>
        <div className="flex flex-col gap-4 w-full">{renderModalContent()}</div>
        <div className="flex flex-row gap-4 justify-end">
          <button
            type="button"
            className="cursor-pointer px-8 py-4 bg-accent w-fit text-bgdark font-semibold hover:opacity-75 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? `${isEditMode ? "Updating" : "Adding"}...`
              : `${isEditMode ? "Update" : "Add"}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-8 py-4 bg-[#C32222] w-fit text-white font-semibold hover:opacity-75"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default AddProfileEntryModal;
