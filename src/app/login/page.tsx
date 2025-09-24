"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthLeftHalf from "../components/Auth/AuthLeftHalf";
import SwitchAuthTypeComponent from "../components/Auth/SwitchAuthTypeComponent";
import AuthSingleInput from "../components/Auth/AuthSingleInput";
import AuthPasswordInput from "../components/Auth/AuthPasswordInput";

function page({ accountType }: { accountType: string }) {
  const router = useRouter();
  const [authAccountType, setAuthAccountType] = React.useState(
    accountType || "client"
  );
  const [loginFormData, setLoginFormData] = React.useState({
    principal: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    // Basic frontend validation
    if (!loginFormData.principal.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }

    if (!loginFormData.password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    // Email format validation (assuming email for now as phone auth is not setup)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginFormData.principal)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          principal: loginFormData.principal,
          password: loginFormData.password,
          isClient: authAccountType === "client",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.errorMessage || "Login failed");
        return;
      }

      toast.success("Login successful!");
      // Redirect to homepage - user can navigate to profile from navbar
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-row gap-0 p-6 h-screen">
      <AuthLeftHalf
        type="login"
        text="Login to jump right back into your gig."
      />
      <div className="w-[50%] h-full flex items-center justify-center">
        <div className="w-120 h-fit flex flex-col gap-4">
          <SwitchAuthTypeComponent
            accountType={authAccountType}
            setAccountType={setAuthAccountType}
          />
          <div className="w-full h-fit flex flex-col gap-4">
            <AuthSingleInput
              type="text"
              label="Email / Phone Number"
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
                setLoginFormData({ ...loginFormData, password: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-6 py-3 bg-accent text-bg1 w-fit h-fit rounded-xl hover:opacity-70 ml-auto disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
          <p className="mx-auto text-center">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-accent cursor-pointer hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
