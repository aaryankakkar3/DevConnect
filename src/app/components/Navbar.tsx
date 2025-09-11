import React from "react";
import { Globe, Search, HelpCircle, LucideIcon } from "lucide-react";

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

function NavItem({ icon, label }: { icon: string; label: string }) {
  const IconComponent = iconMap[icon];

  return (
    <button className="flex flex-row gap-1 justify-center items-center hover:font-semibold">
      <IconComponent size={16} strokeWidth={1.5} />
      {label}
    </button>
  );
}

function Navbar() {
  const bidCount = 15;
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-3xl font-semibold">
        <span className="text-accent">Dev</span> Connect
      </div>
      <div className="rounded-full text-text1 flex flex-row gap-6">
        <NavItem icon="Globe" label="Feed" />
        <button className="flex flex-row gap-1 justify-center items-center hover:font-semibold">
          {bidCount} Bids
        </button>
        <NavItem icon="Search" label="Search devs" />
        <NavItem icon="HelpCircle" label="Help" />
        <button>
          <div className="rounded-full w-6 h-6 border-1 border-text2"></div>
        </button>
        <button
          className="hover:font-semibold cursor-pointer"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
