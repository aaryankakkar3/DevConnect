import React from "react";
import { X } from "lucide-react";

function ExistingImageComponent({
  proofLink,
  removeExistingImage,
}: {
  proofLink: string;
  removeExistingImage: () => void;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="">Existing Image:</span>
      <div className="flex flex-wrap gap-1">
        <div className="flex items-center gap-1 bg-bg2 p-2 rounded-xl">
          <span className="text-base truncate max-w-40">
            {proofLink.split("/").pop()?.split("?")[0] || "Image"}
          </span>
          <button
            type="button"
            onClick={() => removeExistingImage()}
            className="text-text2 hover:text-text1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExistingImageComponent;
