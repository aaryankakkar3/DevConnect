"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validateSignupForm, validateLoginForm } from "@/lib/validation";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  autoComplete?: string;
  className?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormInput({
  label,
  type,
  name,
  autoComplete,
  className,
  required = true,
  value,
  onChange,
}: FormInputProps) {
  const isHidden = className?.includes("hidden");

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <label className={`flex flex-col w-full text-base gap-2 ${className}`}>
      {label}
      <div
        className={`bg-bg2 px-5 py-5 rounded-xl flex flex-row justify-between
        }`}
      >
        <input
          type={
            name == "password" || name == "confirmPassword"
              ? passwordVisible
                ? "text"
                : "password"
              : type
          }
          name={name}
          value={value}
          onChange={onChange}
          className=" focus:outline-none focus:ring-0 w-full bg-transparent"
          required={required && !isHidden}
          autoComplete={autoComplete}
        />
        {(name === "password" || name === "confirmPassword") && (
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
    </label>
  );
}

function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isClient, setIsClient] = useState(true);
  const [isSigningUpFurther, setIsSigningUpFurther] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeFormType = "text-bg1 bg-accent font-semibold";

  const clearFormData = () => {
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateSignupForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Show first validation error as toast
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error(firstError as string);
      }
      return;
    }

    setErrors({});

    const signUpData = {
      fullName: formData.fullName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      isClient: isClient,
    };

    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating account...");

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
          // Show first validation error as toast
          const firstError = Object.values(result.errors)[0];
          if (firstError) {
            toast.error(firstError as string);
          }
        } else {
          toast.error(result.errorMessage || "Signup failed");
        }
        return;
      }

      // Success
      toast.success("Account created successfully! Welcome to DevConnect!");
      clearFormData();

      // Reload the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error. Please try again.");
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateLoginForm({
      email: formData.email,
      password: formData.password,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Show first validation error as toast
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error(firstError as string);
      }
      return;
    }

    setErrors({});

    const loginData = {
      email: formData.email,
      password: formData.password,
      isClient: isClient,
    };

    try {
      // Show loading toast
      const loadingToast = toast.loading("Signing in...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
          // Show first validation error as toast
          const firstError = Object.values(result.errors)[0];
          if (firstError) {
            toast.error(firstError as string);
          }
        } else {
          toast.error(result.errorMessage || "Login failed");
        }
        return;
      }

      // Success
      toast.success(
        `Welcome back! You're now logged in as ${
          isClient ? "Client" : "Developer"
        }.`
      );
      clearFormData();

      // Redirect to the main layout after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
    }
  }

  function handleFirstStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate only the fields shown in first step
    const firstStepData = {
      fullName: formData.fullName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: "",
      confirmPassword: "",
    };

    const validation = validateSignupForm(firstStepData);
    const firstStepErrors: Record<string, string> = {};

    if (validation.errors.fullName)
      firstStepErrors.fullName = validation.errors.fullName;
    if (validation.errors.email)
      firstStepErrors.email = validation.errors.email;
    if (validation.errors.contactNumber)
      firstStepErrors.contactNumber = validation.errors.contactNumber;

    if (Object.keys(firstStepErrors).length > 0) {
      setErrors(firstStepErrors);
      // Show first validation error as toast
      const firstError = Object.values(firstStepErrors)[0];
      if (firstError) {
        toast.error(firstError as string);
      }
      return;
    }

    setErrors({});
    setIsSigningUpFurther(true);
  }

  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-[55%] flex flex-col justify-center items-start gap-6 p-6 ">
        <h1 className="text-2xl">{isLogin ? "Login" : "Sign Up"}</h1>
        <p className="text-base  w-75">
          {isLogin
            ? "Login to pick up right where you left off."
            : "Sign up to hire talent or find work. Get started in just a few minutes."}
        </p>
      </div>
      <div className="w-[45%] p-6 flex justify-center items-center ">
        <form
          onSubmit={(e) => {
            if (isLogin) {
              handleLogin(e);
            } else if (isSigningUpFurther) {
              handleSignUp(e);
            } else {
              handleFirstStep(e);
            }
          }}
          className="w-112.5 h-fit gap-6 flex flex-col items-center justify-center"
        >
          <div
            className={`w-fit h-fit bg-bg2 rounded-full flex flex-row gap-3 ${
              isSigningUpFurther ? "hidden" : ""
            }`}
          >
            <button
              type="button"
              className={`px-20 py-5 rounded-full cursor-pointer hover:bg-accent hover:font-semibold hover:text-bg1 ${
                isClient ? activeFormType : ""
              }`}
              onClick={() => setIsClient(true)}
            >
              Client
            </button>
            <button
              type="button"
              className={`px-20 py-5 rounded-full cursor-pointer hover:bg-accent hover:font-semibold hover:text-bg1 ${
                !isClient ? activeFormType : ""
              }`}
              onClick={() => setIsClient(false)}
            >
              Developer
            </button>
          </div>
          <FormInput
            label="Full Name"
            type="text"
            name="fullName"
            autoComplete="name"
            className={isLogin ? "hidden" : isSigningUpFurther ? "hidden" : ""}
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            className={isSigningUpFurther ? "hidden" : ""}
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <FormInput
            label="Contact Number"
            type="text"
            name="contactNumber"
            autoComplete="tel"
            className={isLogin ? "hidden" : isSigningUpFurther ? "hidden" : ""}
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactNumber: e.target.value,
              }))
            }
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            autoComplete="password"
            className={isLogin || isSigningUpFurther ? "" : "hidden"}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            className={isSigningUpFurther ? "" : "hidden"}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          <div className="w-full flex flex-row justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-accent rounded-xl text-bg1 font-semibold cursor-pointer hover:opacity-50"
            >
              {isLogin ? "Login" : "Submit"}
            </button>
          </div>
          <p>
            {isSigningUpFurther
              ? "Missed something? "
              : isLogin
              ? "Don't have an account? "
              : "Already have an account? "}
            <a
              href="#"
              className="text-accent hover:underline"
              onClick={() => [
                !isSigningUpFurther
                  ? !isLogin
                    ? (setIsLogin(true), clearFormData())
                    : (setIsLogin(false), clearFormData())
                  : setIsSigningUpFurther(false),
              ]}
            >
              {isSigningUpFurther ? "Go back" : isLogin ? "Sign Up" : "Login"}
            </a>
          </p>
        </form>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default AuthForm;
