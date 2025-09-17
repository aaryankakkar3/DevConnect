import React from "react";
import { toast } from "sonner";

function ProofImageInputField({
  setSelectedImages,
}: {
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
  return (
    <label className="flex flex-col gap-1 w-full">
      Proof Image
      <div className="p-4 bg-bg2 focus:outline-none focus:ring-0 flex justify-end">
        <input
          type="file"
          id="course-image-upload"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <label
          htmlFor="course-image-upload"
          className="px-[2px] py-[1px] border border-text2 w-fit cursor-pointer hover:bg-text2 hover:text-bg1"
        >
          Choose Image
        </label>
      </div>
    </label>
  );
}

export default ProofImageInputField;
