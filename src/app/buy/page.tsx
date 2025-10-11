"use client";

import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";

function page() {
  const { currentUser } = useCurrentUser();
  const clearance = currentUser?.clearance == "dev" ? "dev" : "client";
  const tokenType = clearance == "dev" ? "bid" : "project";
  const [tokenPackage, setTokenPackage] = React.useState(
    clearance == "dev" ? 50 : 10
  );
  console.log(clearance);
  console.log(tokenType);
  const [dropDownOpen, setDropDownOpen] = React.useState(false);
  const bidPackages = {
    10: "10 bid tokens - $100",
    25: "25 bid tokens - $200",
    50: "50 bid tokens - $350",
  };
  const projectPackages = {
    1: "1 project tokens - $100",
    5: "5 project tokens - $400",
    10: "10 project tokens - $700",
  };
  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      <div className="p-6 flex flex-col gap-6 min-h-screen">
        <Navbar />
        <div className="p-6 border border-text2 rounded-xl w-full h-full flex flex-col gap-6">
          <h1 className="text-accent text-5xl">Buy {tokenType} tokens</h1>
          <div className="flex flex-col gap-1">
            Available {tokenType.charAt(0).toUpperCase() + tokenType.slice(1)}{" "}
            Tokens:<br></br>
            {currentUser?.tokenCount}
          </div>
          <div className="flex flex-col gap-1">
            Select package:<br></br>
            <div className="relative">
              <button
                onClick={() => {
                  setDropDownOpen(!dropDownOpen);
                }}
                className="flex items-center p-2.5 cursor-pointer flex-row justify-between border border-text2 rounded-xl w-70"
              >
                {clearance == "dev"
                  ? tokenPackage == 10
                    ? bidPackages[10]
                    : tokenPackage == 25
                    ? bidPackages[25]
                    : bidPackages[50]
                  : tokenPackage == 1
                  ? projectPackages[1]
                  : tokenPackage == 5
                  ? projectPackages[5]
                  : projectPackages[10]}
                <ChevronDown
                  className={`w-4 h-4 ${dropDownOpen && "rotate-180"}`}
                />
              </button>
              {dropDownOpen && (
                <div className="absolute top-full left-0 mt-1 flex flex-col gap-0 border border-text2 rounded-xl bg-bg1 z-10 shadow-lg w-70">
                  {clearance == "dev"
                    ? Object.entries(bidPackages).map(
                        ([price, description]) => (
                          <button
                            key={price}
                            onClick={() => [
                              setTokenPackage(parseInt(price)),
                              setDropDownOpen(false),
                            ]}
                            className="p-2.5 cursor-pointer hover:bg-bg2 text-left first:rounded-t-xl last:rounded-b-xl"
                          >
                            {description}
                          </button>
                        )
                      )
                    : Object.entries(projectPackages).map(
                        ([price, description]) => (
                          <button
                            key={price}
                            onClick={() => [
                              setTokenPackage(parseInt(price)),
                              setDropDownOpen(false),
                            ]}
                            className="p-2.5 cursor-pointer hover:bg-bg2 text-left first:rounded-t-xl last:rounded-b-xl"
                          >
                            {description}
                          </button>
                        )
                      )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            Your new {tokenType.charAt(0).toUpperCase() + tokenType.slice(1)}{" "}
            Token Balance will be:<br></br>
            {currentUser?.tokenCount! + tokenPackage}
          </div>
          <button
            type="button"
            className="cursor-pointer ml-auto px-6 py-3 rounded-xl bg-accent w-fit text-bg1 font-semibold hover:opacity-75 disabled:opacity-50"
            onClick={() => {}}
          >
            Buy Tokens
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
