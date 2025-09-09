import React from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

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
      <label className="flex flex-col gap-2 w-full">
        Institution
        <input
          type="text"
          className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
          value={formData.institution}
          onChange={(e) =>
            setFormData({ ...formData, institution: e.target.value })
          }
        />
      </label>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          Score
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.score}
            onChange={(e) =>
              setFormData({ ...formData, score: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          Max Score
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.maxScore}
            onChange={(e) =>
              setFormData({ ...formData, maxScore: e.target.value })
            }
          />
        </label>
      </div>
      <div className="flex flex-row gap-4">
        <label className="flex flex-col gap-2 w-full">
          From
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          To
          <input
            type="text"
            className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 w-full">
        Proof Image
        <div className="py-[15px] px-8 bg-bglight focus:outline-none focus:ring-0 flex justify-end">
          <input
            type="file"
            id="education-image-upload"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <label
            htmlFor="education-image-upload"
            className="px-[2px] py-[1px] border border-muted w-fit cursor-pointer hover:bg-muted hover:text-bgdark transition-colors"
          >
            Choose Image
          </label>
        </div>
      </label>

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
