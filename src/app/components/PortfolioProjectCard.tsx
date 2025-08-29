"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PortfolioProjectCard({
  title,
  description,
  images,
  links,
  linkLabels,
}: {
  title: string;
  description: string;
  images: string[];
  links: string[];
  linkLabels: string[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  return (
    <div className="flex flex-col w-75 h-fit p-3 gap-3 border-2 border-bglight">
      <div
        className="relative w-69 h-38.75 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={images[currentImageIndex]}
          alt={`${title} image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Navigation arrows - only visible on hover */}
        {isHovered && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white bg-opacity-80"
                    : "bg-white bg-opacity-40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-accent">{title}</div>
      <div className="">{description}</div>
      <div className="text-softaccent">
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
    </div>
  );
}

export default PortfolioProjectCard;
