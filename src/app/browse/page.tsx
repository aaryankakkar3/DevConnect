"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import SingleInputField from "../components/Profile/Edit Profile Modals/SingleInputField";
import Sidebar from "../components/Browse/Sidebar";
import { ChevronDown } from "lucide-react";
import ResultsFoundAndSort from "../components/ResultsFoundAndSort";
import ProjectsList from "../components/ProjectsList";

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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");

  // API state management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states - lifted up from Sidebar
  const [keywordFilter, setKeywordFilter] = React.useState({
    dropdownValue: "AND",
    keywords: "",
  });
  const [skillsFilter, setSkillsFilter] = React.useState({
    dropdownValue: "AND",
    skills: "",
  });
  const [budgetFilter, setBudgetFilter] = React.useState({
    min: "",
    max: "",
  });
  const [bidsFilter, setBidsFilter] = React.useState({ min: "", max: "" });
  const [clientRatingFilter, setClientRatingFilter] = React.useState({
    min: "",
    max: "",
  });

  // Function to fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        search: searchQuery,
        keywordCondition: keywordFilter.dropdownValue,
        keywords: keywordFilter.keywords,
        skillsCondition: skillsFilter.dropdownValue,
        skills: skillsFilter.skills,
        ...(budgetFilter.min && { budgetMin: budgetFilter.min }),
        ...(budgetFilter.max && { budgetMax: budgetFilter.max }),
        ...(bidsFilter.min && { bidsMin: bidsFilter.min }),
        ...(bidsFilter.max && { bidsMax: bidsFilter.max }),
        ...(clientRatingFilter.min && {
          clientRatingMin: clientRatingFilter.min,
        }),
        ...(clientRatingFilter.max && {
          clientRatingMax: clientRatingFilter.max,
        }),
      });

      const response = await fetch(`/api/browse?${params}`);

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

  // Fetch projects on component mount and when sortBy changes
  useEffect(() => {
    fetchProjects();
  }, [sortBy]);

  // Handle search button click
  const handleSearch = () => {
    fetchProjects();
  };

  // Handle sort change from ResultsFoundAndSort component
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Handle filter application from Sidebar
  const handleApplyFilters = () => {
    fetchProjects();
  };
  return (
    <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
      <div className="p-6 flex flex-col gap-6">
        <Navbar />
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
        <div className="flex flex-row gap-6">
          <Sidebar
            keywordFilter={keywordFilter}
            setKeywordFilter={setKeywordFilter}
            skillsFilter={skillsFilter}
            setSkillsFilter={setSkillsFilter}
            budgetFilter={budgetFilter}
            setBudgetFilter={setBudgetFilter}
            bidsFilter={bidsFilter}
            setBidsFilter={setBidsFilter}
            clientRatingFilter={clientRatingFilter}
            setClientRatingFilter={setClientRatingFilter}
            onApplyFilters={handleApplyFilters}
          />
          <div className="flex flex-col gap-0 w-full border border-text2 rounded-xl h-fit">
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
              projects.map((project) => (
                <ProjectsList key={project.id} project={project} />
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
