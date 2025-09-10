import { SquareMinus, SquarePlus, X } from "lucide-react";
import React, { useState } from "react";
import SingleInputField from "./SingleInputField";
import DescriptionInput from "./DescriptionInput";

interface EditProjectModalProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
  handleMultipleImageSelect: (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedImages: File[],
    setSelectedImages: (files: File[]) => void
  ) => void;
  removeMultipleImage: (
    index: number,
    selectedImages: File[],
    setSelectedImages: (files: File[]) => void
  ) => void;
  removeExistingMultipleImage: (
    index: number,
    formData: any,
    setFormData: (data: any) => void
  ) => void;
}

function EditProjectModal({
  formData,
  setFormData,
  selectedImages,
  setSelectedImages,
  handleMultipleImageSelect,
  removeMultipleImage,
  removeExistingMultipleImage,
}: EditProjectModalProps) {
  // Initialize linkInputs based on existing data in edit mode
  const [linkInputs, setLinkInputs] = useState(() => {
    // If editing and there are existing links, create inputs for each
    if (
      formData.links &&
      formData.links.length > 0 &&
      formData.links[0] !== ""
    ) {
      return formData.links.map((_: any, index: number) => ({ id: index + 1 }));
    }
    // Default to one input for new projects
    return [{ id: 1 }];
  });

  const addLinkInput = () => {
    const newId =
      linkInputs.length > 0
        ? Math.max(...linkInputs.map((input: any) => input.id)) + 1
        : 1;
    setLinkInputs([...linkInputs, { id: newId }]);
    setFormData({
      ...formData,
      links: [...formData.links, ""],
      linkLabels: [...formData.linkLabels, ""],
    });
  };

  const removeLinkInput = (indexToRemove: number) => {
    if (linkInputs.length > 1) {
      // Remove the input at the specific index
      const newLinkInputs = linkInputs.filter(
        (_: any, index: number) => index !== indexToRemove
      );
      setLinkInputs(newLinkInputs);

      // Remove the corresponding link and label data
      const newLinks = formData.links.filter(
        (_: any, index: number) => index !== indexToRemove
      );
      const newLinkLabels = formData.linkLabels.filter(
        (_: any, index: number) => index !== indexToRemove
      );

      setFormData({
        ...formData,
        links: newLinks,
        linkLabels: newLinkLabels,
      });
    }
  };

  const removeLastLinkInput = () => {
    if (linkInputs.length > 1) {
      setLinkInputs(linkInputs.slice(0, -1));
      setFormData({
        ...formData,
        links: formData.links.slice(0, -1),
        linkLabels: formData.linkLabels.slice(0, -1),
      });
    }
  };

  return (
    <>
      <SingleInputField
        type="text"
        label="Project Name"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <label className="flex flex-col gap-2 w-full">
        Images
        <div className="py-[15px] px-8 bg-bglight focus:outline-none focus:ring-0 flex justify-end">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={(e) =>
              handleMultipleImageSelect(e, selectedImages, setSelectedImages)
            }
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="px-[2px] py-[1px] border border-muted w-fit cursor-pointer hover:bg-muted hover:text-bgdark transition-colors"
          >
            Choose Images
          </label>
        </div>
      </label>

      {/* Display existing images (for edit mode) */}
      {formData.images &&
        formData.images.length > 0 &&
        formData.images[0] !== "" && (
          <div className="flex flex-col gap-2 w-full">
            <span className="">Existing Images:</span>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((imageUrl: string, index: number) => (
                <div
                  key={`existing-${index}`}
                  className="flex items-center gap-2 bg-bglight p-2 rounded"
                >
                  <span className="text-s truncate max-w-40">
                    {imageUrl.split("/").pop()?.split("?")[0] || "Image"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      removeExistingMultipleImage(index, formData, setFormData)
                    }
                    className="text-muted2 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Display selected new images */}
      {selectedImages.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <span className="">New Images to Upload:</span>
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((file, index) => (
              <div
                key={`new-${index}`}
                className="flex items-center gap-2 bg-bglight p-2 rounded"
              >
                <span className="text-s truncate max-w-40">{file.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    removeMultipleImage(
                      index,
                      selectedImages,
                      setSelectedImages
                    )
                  }
                  className="text-muted2 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <DescriptionInput
        value={formData.description}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
          // Auto-resize textarea
          e.target.style.height = "auto";
          e.target.style.height = Math.max(59, e.target.scrollHeight) + "px";
        }}
      />
      <div className="flex flex-col gap-2">
        {linkInputs.map((linkInput: any, index: number) => (
          <div key={linkInput.id} className="flex flex-row gap-4 items-end">
            <SingleInputField
              label="Proof Link"
              type="text"
              value={formData.links[index] || ""}
              onChange={(e) => {
                const newLinks = [...formData.links];
                newLinks[index] = e.target.value;
                setFormData({ ...formData, links: newLinks });
              }}
            />

            <SingleInputField
              label="Link Label"
              type="text"
              value={formData.linkLabels[index] || ""}
              onChange={(e) => {
                const newLinkLabels = [...formData.linkLabels];
                newLinkLabels[index] = e.target.value;
                setFormData({ ...formData, linkLabels: newLinkLabels });
              }}
            />
            <div className="flex h-[51px] w-fit justify-center items-center">
              <button
                type="button"
                onClick={() => removeLinkInput(index)}
                className="text-[28px] text-muted2 hover:text-white cursor-pointer"
                disabled={linkInputs.length === 1}
              >
                x
              </button>
            </div>
          </div>
        ))}
        <div className="w-full flex justify-start gap-2">
          {linkInputs.length > 1 && (
            <SquareMinus
              strokeWidth={1}
              className="w-9 h-9 text-muted hover:text-white cursor-pointer"
              onClick={removeLastLinkInput}
            />
          )}
          <SquarePlus
            strokeWidth={1}
            className="w-9 h-9 text-muted hover:text-white cursor-pointer"
            onClick={addLinkInput}
          />
        </div>
      </div>
    </>
  );
}

export default EditProjectModal;
