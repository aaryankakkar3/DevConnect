"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import SingleInputField from "@/app/components/Profile/Edit Profile Modals/SingleInputField";
import { ChevronDown, Star } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ResultsFoundAndSort from "@/app/components/ResultsFoundAndSort";
import ProjectsList from "@/app/components/ProjectsList";

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
  }, [currentSelection, sortBy]);

  // Handle search button click
  const handleSearch = () => {
    const status = currentSelection === "Open Projects" ? "open" : "closed";
    fetchProjects(sortBy, searchQuery, status);
  };

  // Handle sort change from ResultsFoundAndSort component
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
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
  return (
    <ProtectedRoute
      requireAuth={true}
      requiredClearance={["client"]}
      requiredVerification={["verified"]}
    >
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
          <ResultsFoundAndSort
            resultsCount={projects.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          {loading ? (
            <div className="p-6 text-center">Loading projects...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center">No projects found</div>
          ) : (
            projects.map((project: Project) => (
              <ProjectsList key={project.id} project={project} />
            ))
          )}
        </div>
        <div className=""></div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
