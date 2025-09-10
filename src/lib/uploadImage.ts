// Single image upload function
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const response = await fetch("/api/upload/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: [reader.result as string],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        console.log("Upload response:", result); // Debug log

        // Check multiple possible response formats
        if (result.success && result.data && result.data.length > 0) {
          resolve(result.data[0]);
        } else if (result.data && typeof result.data === "string") {
          resolve(result.data);
        } else if (result.urls && result.urls.length > 0) {
          resolve(result.urls[0]);
        } else if (result.url) {
          resolve(result.url);
        } else {
          console.error("Unexpected response format:", result);
          throw new Error("No image URL returned from upload service");
        }
      } catch (error) {
        console.error("Upload error:", error);
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// Multiple images upload function (for projects only)
export const uploadImages = async (files: File[]): Promise<string[]> => {
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

// Single image upload that returns URL (convenience function for single-image modals)
export const uploadSingleImage = async (file: File): Promise<string> => {
  const urls = await uploadImages([file]);
  return urls[0];
};
