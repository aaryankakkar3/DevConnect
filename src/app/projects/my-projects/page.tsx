"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import SingleInputField from "@/app/components/Profile/Edit Profile Modals/SingleInputField";
import { ChevronDown, Star } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface Project {
  id: string;
  title: string;
  budget: string;
  bidCount: string;
  postedTime: string;
  skills: string[];
  shortDesc: string;
  clientRating: string;
  ratingCount: string;
  status: string;
}

function page() {
  const router = useRouter();
  const [currentSelection, setCurrentSelection] =
    React.useState("Open Projects");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);

  // API state management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch projects from API
  const fetchProjects = async (
    sortValue: string,
    searchValue: string = "",
    status: string = "open"
  ) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        sortBy: sortValue,
        status: status,
        search: searchValue,
      });

      const response = await fetch(`/api/projects/my-projects?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects when parameters change
  useEffect(() => {
    const status = currentSelection === "Open Projects" ? "open" : "closed";
    fetchProjects(sortBy, searchQuery, status);
  }, [sortBy, currentSelection]);

  // Handle search button click
  const handleSearch = () => {
    const status = currentSelection === "Open Projects" ? "open" : "closed";
    fetchProjects(sortBy, searchQuery, status);
  };

  function Nav() {
    const Button = ({
      buttonText,
      link,
    }: {
      buttonText: string;
      link: string;
    }) => (
      <button
        className={`px-12 py-3 rounded-xl cursor-pointer ${
          currentSelection === buttonText
            ? "bg-accent text-bg1"
            : "hover:bg-bg2 text-text1"
        }`}
        onClick={() => {
          setCurrentSelection(buttonText);
        }}
      >
        {buttonText}
      </button>
    );

    return (
      <div className="flex flex-row gap-4 border border-text2 text-base w-fit h-fit rounded-xl mx-auto">
        <Button buttonText="Open Projects" link="/projects/my-projects" />
        <Button buttonText="Closed Projects" link="/projects/closed-projects" />
      </div>
    );
  }

  function SortDropDownButton({
    forValue,
    forLabel,
  }: {
    forValue: string;
    forLabel: string;
  }) {
    return (
      <button
        onClick={() => {
          setSortBy(forValue);
          setSortDropdownOpen(false);
        }}
        className={`w-full px-4 py-2 text-left hover:bg-bg2 ${
          sortBy === forValue
            ? "bg-accent text-bg1 hover:bg-accent"
            : "text-text1"
        }`}
      >
        {forLabel}
      </button>
    );
  }
  return (
    <ProtectedRoute requireAuth={true} requiredClearance={["client"]}>
      <div className="p-6 flex flex-col gap-6">
        <Navbar />
        <Nav />
        <div className="flex flex-row gap-2">
          <SingleInputField
            label=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search projects..."
          />
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-accent text-bg1 rounded-xl hover:opacity-70 cursor-pointer"
          >
            Search
          </button>
        </div>
        <div className="flex flex-col gap-0 w-full rounded-xl border border-text2">
          <div className="p-6 flex flex-row justify-between items-center border-b border-text2">
            <p className="">{projects.length} results found</p>
            <div className="flex flex-row gap-1 items-center relative">
              <p className="">Sort by:</p>
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="px-2 py-1 gap-2 w-fit hover:bg-bg2 hover:text-text1 border border-text2 flex justify-between items-center cursor-pointer"
                >
                  {sortBy === "newest" && "Newest First"}
                  {sortBy === "oldest" && "Oldest First"}
                  {sortBy === "budget-high" && "Budget: High to Low"}
                  {sortBy === "budget-low" && "Budget: Low to High"}
                  {sortBy === "title" && "Title A-Z"}
                  <ChevronDown
                    className={`w-4 h-4 ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-bg1 border border-text2 z-10">
                    <SortDropDownButton
                      forLabel="Newest First"
                      forValue="newest"
                    />
                    <SortDropDownButton
                      forLabel="Oldest First"
                      forValue="oldest"
                    />
                    <SortDropDownButton
                      forLabel="Budget: High to Low"
                      forValue="budget-high"
                    />
                    <SortDropDownButton
                      forLabel="Budget: Low to High"
                      forValue="budget-low"
                    />
                    <SortDropDownButton
                      forLabel="Highest Bids"
                      forValue="bids-high"
                    />
                    <SortDropDownButton
                      forLabel="Lowest Bids"
                      forValue="bids-low"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="p-6 text-center">Loading projects...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center">No projects found</div>
          ) : (
            projects.map((project: Project, index: number) => (
              <div
                key={project.id}
                className="p-6 flex flex-col gap-2 border-b border-text2 last:border-b-0"
              >
                <div className="flex flex-row justify-between">
                  <h1 className="text-accent text-2xl ">{project.title}</h1>
                  <p className="">
                    {project.bidCount} bids | Posted {project.postedTime}
                  </p>
                </div>
                <p>Budget - {project.budget}</p>
                <p className="font-semibold">{project.skills.join(" | ")}</p>
                <p className="">{project.shortDesc}</p>
                <div className="flex flex-row gap-1 items-center ">
                  <div className="flex flex-row gap-0 items-center">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = parseFloat(project.clientRating);
                      const isFilled = i < Math.floor(rating);
                      return (
                        <Star
                          key={i}
                          strokeWidth={1}
                          fill={isFilled ? "#F7DA00" : "none"}
                          size={16}
                        />
                      );
                    })}
                  </div>
                  ({project.ratingCount})
                </div>
              </div>
            ))
          )}
        </div>
        <div className=""></div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
