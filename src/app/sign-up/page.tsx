"use client";

import React from "react";
import AuthLeftHalf from "../components/Auth/AuthLeftHalf";
import SwitchAuthTypeComponent from "../components/Auth/SwitchAuthTypeComponent";
import AuthSingleInput from "../components/Auth/AuthSingleInput";
import AuthPasswordInput from "../components/Auth/AuthPasswordInput";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

function page({ accountType }: { accountType: string }) {
  const router = useRouter();
  const [signupFormData, setSignupFormData] = React.useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [signupFormData2, setSignupFormData2] = React.useState({
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [phase, setPhase] = React.useState(1);
  const [authAccountType, setAuthAccountType] = React.useState(
    accountType || "client"
  );

  const handlePhaseOneSubmit = async () => {
    // Basic frontend validation
    if (!signupFormData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!signupFormData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!signupFormData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupFormData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/validate-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: signupFormData.fullName,
          email: signupFormData.email,
          phoneNumber: signupFormData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Validation failed");
        return;
      }
      setPhase(2);
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("An error occurred during validation");
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseTwoSubmit = async () => {
    // Username validation
    if (!signupFormData2.username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (signupFormData2.username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (signupFormData2.username.length > 15) {
      toast.error("Username must be 15 characters or less");
      return;
    }

    // Username format validation (only letters, numbers, underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(signupFormData2.username)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    // Password validation
    if (!signupFormData2.password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    if (!signupFormData2.confirmPassword.trim()) {
      toast.error("Please confirm your password");
      return;
    }

    if (signupFormData2.password !== signupFormData2.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Password strength validation
    const password = signupFormData2.password;
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!minLength) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!hasLowercase) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }
    if (!hasUppercase) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!hasDigit) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!hasSymbol) {
      toast.error("Password must contain at least one special character");
      return;
    }

    setLoading(true);

    try {
      // Merge all form data
      const completeFormData = {
        fullName: signupFormData.fullName,
        email: signupFormData.email,
        contactNumber: signupFormData.phoneNumber,
        password: signupFormData2.password,
        confirmPassword: signupFormData2.confirmPassword,
        username: signupFormData2.username,
        authAccountType: authAccountType, // "client" or "developer"
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.errorMessage || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireGuest={true} redirectTo="/">
      <div className="flex flex-row gap-0 p-6 h-screen">
        <AuthLeftHalf
          type="signup"
          text="Sign up to hire talent or find work. Get started in just a few minutes."
        />
        <div className="w-[50%] h-full flex items-center justify-center">
          {phase == 1 && (
            <div className="w-120 h-fit flex flex-col gap-4">
              <SwitchAuthTypeComponent
                accountType={authAccountType}
                setAccountType={setAuthAccountType}
              />
              <div className="w-full h-fit flex flex-col gap-4">
                <AuthSingleInput
                  type="text"
                  label="Full Name"
                  value={signupFormData.fullName}
                  onChange={(e) =>
                    setSignupFormData({
                      ...signupFormData,
                      fullName: e.target.value,
                    })
                  }
                />
                <AuthSingleInput
                  type="text"
                  label="Email"
                  value={signupFormData.email}
                  onChange={(e) =>
                    setSignupFormData({
                      ...signupFormData,
                      email: e.target.value,
                    })
                  }
                />
                <AuthSingleInput
                  type="text"
                  label="Phone Number"
                  value={signupFormData.phoneNumber}
                  onChange={(e) =>
                    setSignupFormData({
                      ...signupFormData,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <button
                onClick={() => {
                  handlePhaseOneSubmit();
                }}
                disabled={loading}
                className={`px-6 py-3 bg-accent text-bg1 w-fit h-fit rounded-xl ml-auto cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-70"
                }`}
              >
                {loading ? "Validating..." : "Continue"}
              </button>

              <p className="mx-auto text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-accent cursor-pointer hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          )}
          {phase == 2 && (
            <div className="w-120 h-fit flex flex-col gap-4">
              <div className="w-full h-fit flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <AuthSingleInput
                    type="text"
                    label="Username"
                    value={signupFormData2.username}
                    onChange={(e) =>
                      setSignupFormData2({
                        ...signupFormData2,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <AuthPasswordInput
                  label="Password"
                  value={signupFormData2.password}
                  onChange={(e) =>
                    setSignupFormData2({
                      ...signupFormData2,
                      password: e.target.value,
                    })
                  }
                />
                <AuthPasswordInput
                  label="Confirm Password"
                  value={signupFormData2.confirmPassword}
                  onChange={(e) =>
                    setSignupFormData2({
                      ...signupFormData2,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-row gap-2 w-full justify-end">
                <button
                  onClick={() => {
                    setPhase(1);
                  }}
                  className={`px-6 py-3 font-semibold bg-bg1 text-text1 border border-text2 w-fit h-fit rounded-xl hover:bg-bg2 cursor-pointer`}
                >
                  Go back
                </button>
                <button
                  onClick={() => {
                    handlePhaseTwoSubmit();
                  }}
                  disabled={loading}
                  className={`px-6 py-3 font-semibold bg-accent text-bg1 w-fit h-fit rounded-xl ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-70 cursor-pointer"
                  }`}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
