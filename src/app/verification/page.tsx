"use client";

import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import { ChevronDown } from "lucide-react";
import NewImageComponent from "../components/Profile/Edit Profile Modals/NewImageComponent";
import ExistingImageComponent from "../components/Profile/Edit Profile Modals/ExistingImageComponent";
import { useCurrentUser } from "../hooks/useCurrentUser";
import toast from "react-hot-toast";
import { uploadImages } from "@/lib/uploadImage";

function VerificationPage() {
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    gender: "",
    dob: new Date(),
    verificationPhotoUrl: "",
    idPhotoUrl: "",
  });
  const [verificationPhoto, setVerificationPhoto] = React.useState<File[]>([]);
  const [idPhoto, setIdPhoto] = React.useState<File[]>([]);

  const handleSubmit = async () => {
    const isDev = currentUser?.clearance === "dev";

    // Validation
    if (!formData.gender) {
      toast.error("Please select a gender");
      return;
    }

    if (!formData.dob) {
      toast.error("Please select your date of birth");
      return;
    }

    // Validate date is not in the future
    if (formData.dob > new Date()) {
      toast.error("Date of birth cannot be in the future");
      return;
    }

    // Dev-specific validation
    if (isDev) {
      if (verificationPhoto.length === 0 && !formData.verificationPhotoUrl) {
        toast.error("Please upload a verification photo");
        return;
      }

      if (idPhoto.length === 0 && !formData.idPhotoUrl) {
        toast.error("Please upload an ID photo");
        return;
      }
    }

    setLoading(true);

    try {
      let selfieCheckPhotoUrl = formData.verificationPhotoUrl;
      let idPhotoUrl = formData.idPhotoUrl;

      // Upload verification photo if new file selected
      if (isDev && verificationPhoto.length > 0) {
        const uploadedUrls = await uploadImages(verificationPhoto);
        if (uploadedUrls.length > 0) {
          selfieCheckPhotoUrl = uploadedUrls[0];
        }
      }

      // Upload ID photo if new file selected
      if (isDev && idPhoto.length > 0) {
        const uploadedUrls = await uploadImages(idPhoto);
        if (uploadedUrls.length > 0) {
          idPhotoUrl = uploadedUrls[0];
        }
      }

      // Prepare request body
      const requestBody: any = {
        gender: formData.gender,
        dob: formData.dob.toISOString(),
      };

      if (isDev) {
        requestBody.selfieCheckPhoto = selfieCheckPhotoUrl;
        requestBody.idPhoto = idPhotoUrl;
      }

      // Submit to appropriate API
      const apiRoute = isDev
        ? "/api/verification/dev"
        : "/api/verification/client";
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to submit verification");
        return;
      }

      toast.success(data.message || "Verification submitted successfully!");

      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("An error occurred while submitting verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute
      requireAuth={true}
      requiredVerification={["requested", "unverified"]}
      redirectTo="/profile"
    >
      <div className="p-6 flex flex-col gap-6">
        <Navbar />
        {currentUser?.verificationStatus == "unverified" && (
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 w-full">
              Gender
              <div className="relative">
                <select
                  className="p-5 pr-12 bg-bg1 border border-text2 rounded-xl appearance-none w-full text-text1 cursor-pointer"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="man">Male</option>
                  <option value="woman">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                  <ChevronDown
                    size={20}
                    className="text-text1"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </label>

            <label className="flex flex-col gap-1 w-full">
              Date of Birth
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="p-5 bg-bg1 border border-text2 rounded-xl w-full text-text1 cursor-pointer"
                value={
                  formData.dob instanceof Date
                    ? formData.dob.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, dob: new Date(e.target.value) })
                }
              />
            </label>
            {currentUser?.clearance == "dev" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-text1">Verification Photo</label>
                  <div className="p-5 rounded-xl bg-bg1 border border-text2 flex justify-end">
                    <input
                      type="file"
                      id="verification-photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        const file = files[0];
                        const isValidType = file.type.startsWith("image/");
                        const isValidSize = file.size <= 10 * 1024 * 1024;
                        if (!isValidType) {
                          alert(`${file.name} is not a valid image file`);
                          return;
                        }
                        if (!isValidSize) {
                          alert(`${file.name} is too large (max 10MB)`);
                          return;
                        }
                        setVerificationPhoto([file]);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="verification-photo-upload"
                      className="px-2 py-1 rounded-xl border border-text2 w-fit cursor-pointer hover:bg-bg2"
                    >
                      Choose Image
                    </label>
                  </div>
                  {formData.verificationPhotoUrl &&
                    formData.verificationPhotoUrl.trim() !== "" && (
                      <ExistingImageComponent
                        proofLink={formData.verificationPhotoUrl}
                        removeExistingImage={() =>
                          setFormData({ ...formData, verificationPhotoUrl: "" })
                        }
                      />
                    )}
                  {verificationPhoto.length > 0 && (
                    <NewImageComponent
                      selectedImages={verificationPhoto}
                      removeImage={() => setVerificationPhoto([])}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text1">ID Photo</label>
                  <div className="p-5 rounded-xl bg-bg1 border border-text2 flex justify-end">
                    <input
                      type="file"
                      id="id-photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        const file = files[0];
                        const isValidType = file.type.startsWith("image/");
                        const isValidSize = file.size <= 10 * 1024 * 1024;
                        if (!isValidType) {
                          alert(`${file.name} is not a valid image file`);
                          return;
                        }
                        if (!isValidSize) {
                          alert(`${file.name} is too large (max 10MB)`);
                          return;
                        }
                        setIdPhoto([file]);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="id-photo-upload"
                      className="px-2 py-1 rounded-xl border border-text2 w-fit cursor-pointer hover:bg-bg2"
                    >
                      Choose Image
                    </label>
                  </div>
                  {formData.idPhotoUrl && formData.idPhotoUrl.trim() !== "" && (
                    <ExistingImageComponent
                      proofLink={formData.idPhotoUrl}
                      removeExistingImage={() =>
                        setFormData({ ...formData, idPhotoUrl: "" })
                      }
                    />
                  )}
                  {idPhoto.length > 0 && (
                    <NewImageComponent
                      selectedImages={idPhoto}
                      removeImage={() => setIdPhoto([])}
                    />
                  )}
                </div>
              </>
            )}

            <div className="flex flex-row gap-4 ml-auto">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="cursor-pointer px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : currentUser?.clearance === "client"
                  ? "Submit"
                  : "Request Verification"}
              </button>
            </div>
          </div>
        )}
        {currentUser?.verificationStatus == "requested" && (
          <p className="text-2xl">
            Verification pending. Please check back later
          </p>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default VerificationPage;
