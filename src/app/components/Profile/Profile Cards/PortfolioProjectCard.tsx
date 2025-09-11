"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PortfolioProjectCard({
  id,
  title,
  description,
  images,
  links,
  linkLabels,
  onEdit,
}: {
  id: string;
  title: string;
  description: string;
  images: string[];
  links: string[];
  linkLabels: string[];
  onEdit?: (cardData: any) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Filter out empty or invalid image URLs
  const validImages = images?.filter((img) => img && img.trim() !== "") || [];

  // Reset image index if it's out of bounds
  useEffect(() => {
    if (currentImageIndex >= validImages.length && validImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [validImages.length, currentImageIndex]);

  console.log("PortfolioProjectCard Debug:", {
    id,
    title,
    originalImages: images,
    validImages,
    currentImageIndex,
    currentImage: validImages[currentImageIndex],
  });

  const handleEdit = () => {
    onEdit?.({
      id,
      title,
      description,
      images,
      links,
      linkLabels,
    });
  };

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? validImages.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === validImages.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  const handleImageError = () => {
    console.error("Image failed to load:", validImages[currentImageIndex]);
    setImageLoadError(true);
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3 border-2 border-bg2">
      <div
        className="relative w-full aspect-video overflow-hidden bg-bg2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {validImages.length > 0 && validImages[currentImageIndex] ? (
          <>
            <img
              src={validImages[currentImageIndex]}
              alt={`${title} image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />

            {imageLoadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg2 text-text2 text-center p-4">
                <div>
                  <div className="text-sm">Image failed to load</div>
                  <div className="text-xs text-text2 mt-1 break-all">
                    {validImages[currentImageIndex]}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bg2 text-text2">
            No image available
          </div>
        )}

        {/* Navigation arrows - only visible on hover */}
        {isHovered && validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-bg2 hover:bg-bg1 bg-opacity-50 text-text1 p-1 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-bg2 hover:bg-bg1 bg-opacity-50 text-text1 p-1 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image indicators */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {validImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-text1 bg-opacity-80"
                    : "bg-text1 bg-opacity-40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-accent">{title}</div>
      <div className="">{description}</div>
      <div className="flex flex-row justify-between items-end">
        <div className="text-accent2">
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {linkLabels[index]}
              </a>
              <br />
            </React.Fragment>
          ))}
        </div>
        {onEdit && (
          <button
            onClick={handleEdit}
            className="text-text2 hover:text-text1 cursor-pointer text-left"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default PortfolioProjectCard;
