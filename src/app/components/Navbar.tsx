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
        className="flex cursor-pointer flex-row gap-1 justify-center items-center hover:font-semibold group"
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
        <div className="absolute top-full left-0 z-50">
          {/* Invisible bridge to prevent hover gap */}
          <div className="h-1 w-full"></div>
          <div className="bg-bg1 w-fit flex flex-col gap-1">
            {dropdownItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="block cursor-pointer w-full text-left pr-2 py-1 hover:underline first:rounded-t-xl last:rounded-b-xl transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const router = useRouter();
  const { currentUser, logout } = useCurrentUser();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const bidCount = 15;
  const projectCount = 5;

  const handleLogout = async () => {
    try {
      await logout();
      // Use replace to prevent back button issues and force a fresh page load
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect even if logout fails
      window.location.replace("/login");
    }
  };

  const bidsDropdown = [
    { label: "My bids", onClick: () => router.push("/bids/my-bids") },
    {
      label: "Buy bid tokens",
      onClick: () => router.push("/buy"),
    },
  ];

  const userDropdown = [
    {
      label: "Profile",
      onClick: () => router.push(`/profile/${currentUser?.username}`),
    },
    { label: "Account", onClick: () => router.push("/account") },
    { label: "Logout", onClick: handleLogout },
  ];

  const projectsDropdown = [
    {
      label: "My Projects",
      onClick: () => router.push("/projects/my-projects"),
    },
    {
      label: "Buy Project Tokens",
      onClick: () => router.push("/buy"),
    },
    {
      label: "Create Project",
      onClick: () => router.push("/projects/create-project"),
    },
  ];

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-5xl ">
        <span className="text-accent">Dev</span> Connect
      </div>
      <div className="rounded-full text-text1 flex flex-row gap-6">
        <NavItem
          icon="Globe"
          label="Browse"
          onClick={() => router.push("/browse")}
        />
        {currentUser?.clearance == "dev" && (
          <NavItem
            label={`(${bidCount}) Bids`}
            dropdownItems={bidsDropdown}
            isHovered={hoveredItem === "bids"}
            onMouseEnter={() => setHoveredItem("bids")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => router.push("/my-bids")}
          />
        )}
        {currentUser?.clearance == "client" && (
          <NavItem
            label={`(${projectCount}) Projects`}
            dropdownItems={projectsDropdown}
            isHovered={hoveredItem === "projects"}
            onMouseEnter={() => setHoveredItem("projects")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => router.push("/my-projects")}
          />
        )}

        <NavItem
          icon="Search"
          label="Search devs"
          onClick={() => router.push("/search-devs")}
        />
        <NavItem
          label={currentUser?.username || "User"}
          dropdownItems={userDropdown}
          isHovered={hoveredItem === "user"}
          onMouseEnter={() => setHoveredItem("user")}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => router.push(`/profile/${currentUser?.username}`)}
        />
      </div>
    </div>
  );
}

export default Navbar;
