import React, { useState } from "react";
import { Globe, Search, HelpCircle, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Globe,
  Search,
  HelpCircle,
};

const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Redirect to login page or handle successful logout
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

function NavItem({
  icon,
  label,
  onClick,
  dropdownItems,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  icon?: string;
  label: string;
  onClick?: () => void;
  dropdownItems?: { label: string; onClick: () => void }[];
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="flex flex-row gap-1 justify-center items-center hover:font-semibold group"
        onClick={onClick}
      >
        {IconComponent && (
          <IconComponent
            size={16}
            strokeWidth={1.5}
            className="group-hover:stroke-2"
          />
        )}
        {label}
      </button>

      {/* Dropdown Menu */}
      {dropdownItems && isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-bg1 border border-text2 rounded-xl shadow-lg z-50 min-w-40">
          {dropdownItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="block w-full text-left px-4 py-3 hover:bg-bg2 first:rounded-t-xl last:rounded-b-xl transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  console.log("Current User in Navbar:", currentUser);
  const clearance = currentUser?.clearance;
  const bidCount = 15;
  const projectCount = 15;
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-5xl ">
        <span className="text-accent">Dev</span> Connect
      </div>
      <div className="rounded-full text-text1 flex flex-row gap-6">
        <NavItem icon="Globe" label="Browse" />
        <NavItem label={`(${bidCount}) bids`} />
        <NavItem icon="Search" label="Search devs" />
        <button className="flex flex-row gap-1 hover:font-semibold">
          {currentUser?.username}
        </button>
        {/* <button
          className="hover:font-semibold cursor-pointer"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}

export default Navbar;
