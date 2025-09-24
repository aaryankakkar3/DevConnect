import React from "react";

function AuthLeftHalf({
  type,
  text,
}: {
  type: "login" | "signup";
  text: string;
}) {
  return (
    <div className="relative w-[50%] h-full flex flex-col gap-6 justify-center">
      <h1 className="text-8xl">{type === "login" ? "Log In" : "Sign Up"}</h1>
      <p className="text-base w-120">{text}</p>
      <h1 className="text-5xl absolute top-0 left-0">
        <span className="text-accent">Dev</span> Connect
      </h1>
    </div>
  );
}

export default AuthLeftHalf;
