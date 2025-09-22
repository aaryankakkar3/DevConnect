import React, { useState } from "react";
import SingleInputField from "../Profile/Edit Profile Modals/SingleInputField";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import toast from "react-hot-toast";

function ChangeSettingsModal({
  type,
  onClose,
}: {
  type?: "email" | "password";
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    newData: "",
    confirmNewData: "",
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!minLength) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }
    if (!hasLowercase) {
      toast.error("Password must contain at least one lowercase letter.");
      return false;
    }
    if (!hasUppercase) {
      toast.error("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!hasDigit) {
      toast.error("Password must contain at least one digit.");
      return false;
    }
    if (!hasSymbol) {
      toast.error("Password must contain at least one symbol.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (formData.newData === "" || formData.confirmNewData === "") {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.newData !== formData.confirmNewData) {
      toast.error(`New ${type} and confirmation do not match.`);
      return;
    }

    // Email validation
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.newData)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    // Password validation
    if (type === "password" && !validatePassword(formData.newData)) {
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        type === "email" ? "/api/auth/changeEmail" : "/api/auth/changePassword";

      const body =
        type === "email"
          ? { newEmail: formData.newData }
          : { newPassword: formData.newData };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || "Something went wrong");
      }

      if (type === "email") {
        toast.success(
          "Confirmation email sent! Check your new email address to complete the change."
        );
      } else {
        toast.success("Password updated successfully!");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const { currentUser } = useCurrentUser();
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-bg1 opacity-30 transition-opacity" />
      <form className="relative z-20 w-175 bg-bg1 border border-bg2 flex flex-col p-5 gap-5 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl">
          Change{" "}
          <span className="text-accent">
            {type == "email" ? "Email" : "Password"}
          </span>
        </h2>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 w-full cursor-pointer">
            Current {type == "email" ? "Email" : "Password"}
            <div className="p-4 bg-bg2">
              {type == "email"
                ? currentUser?.email
                : "*************************"}
            </div>
          </label>
          <SingleInputField
            label={type == "email" ? "New Email" : "New Password"}
            onChange={(e) =>
              setFormData({ ...formData, newData: e.target.value })
            }
            value={formData.newData}
            type={type == "email" ? "text" : "password"}
          />

          <SingleInputField
            label={
              type == "email" ? "Confirm New Email" : "Confirm New Password"
            }
            onChange={(e) =>
              setFormData({ ...formData, confirmNewData: e.target.value })
            }
            value={formData.confirmNewData}
            type={type == "email" ? "text" : "password"}
          />
        </div>
        <div className="flex flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              handleSubmit();
            }}
            disabled={loading}
            className="cursor-pointer px-8 py-4 bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : type == "email"
              ? "Change Email"
              : "Change Password"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-8 py-4 bg-[#C32222] w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangeSettingsModal;
