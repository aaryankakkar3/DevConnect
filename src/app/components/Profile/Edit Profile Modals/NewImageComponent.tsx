import React from "react";
import { X } from "lucide-react";

function NewImageComponent({
  selectedImages,
  removeImage,
}: {
  selectedImages: File[];
  removeImage: () => void;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="">New Image to Upload</span>
      <div className="flex flex-wrap gap-1">
        <div className="flex items-center gap-1 bg-bg2 p-2 rounded-xl">
          <span className="text-base truncate max-w-40">
            {selectedImages[0].name}
          </span>
          <button
            type="button"
            onClick={() => removeImage()}
            className="text-text2 hover:text-text1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewImageComponent;
