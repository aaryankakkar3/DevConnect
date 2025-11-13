"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthLeftHalf from "../components/Auth/AuthLeftHalf";
import SwitchAuthTypeComponent from "../components/Auth/SwitchAuthTypeComponent";
import AuthSingleInput from "../components/Auth/AuthSingleInput";
import AuthPasswordInput from "../components/Auth/AuthPasswordInput";
import ProtectedRoute from "../components/ProtectedRoute";

function page() {
  const router = useRouter();
  const [loginFormData, setLoginFormData] = React.useState({
    principal: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    // Basic frontend validation
    if (!loginFormData.principal.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!loginFormData.password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginFormData.principal)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/adminLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          principal: loginFormData.principal,
          password: loginFormData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.errorMessage || "Admin login failed");
        return;
      }

      toast.success("Admin login successful!");
      router.push("/adminApproval");
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("An error occurred during admin login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireGuest={true} redirectTo="/">
      <div className="flex flex-row gap-0 p-6 h-screen">
        <AuthLeftHalf type="login" text="Admin Login" />
        <div className="w-[50%] h-full flex items-center justify-center">
          <div className="w-120 h-fit flex flex-col gap-4">
            <div className="w-full h-fit flex flex-col gap-4">
              <AuthSingleInput
                type="text"
                label="Email"
                value={loginFormData.principal}
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    principal: e.target.value,
                  })
                }
              />
              <AuthPasswordInput
                label="Password"
                value={loginFormData.password}
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-6 py-3 font-semibold bg-accent text-bg1 w-fit h-fit rounded-xl hover:opacity-70 ml-auto disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Admin Login"}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
