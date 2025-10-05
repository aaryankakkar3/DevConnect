"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import SingleInputField from "../../components/Profile/Edit Profile Modals/SingleInputField";
import ResultsFoundAndSort from "../../components/ResultsFoundAndSort";
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
  bidData: {
    id: string;
    details: string;
    price: string;
    completionTime: number;
    bidTime: Date;
    bidder: {
      username: string;
      name: string;
      rating: string;
      ratingCount: string;
    };
  };
}

function MyBids() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch user's bids from API
  const fetchMyBids = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        search: searchQuery,
      });

      const response = await fetch(`/api/bids/mybids?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch my bids");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery]);

  // Fetch bids on component mount and when sortBy changes
  useEffect(() => {
    fetchMyBids();
  }, [fetchMyBids]);

  // Handle sort change from ResultsFoundAndSort component
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Handle search button click
  const handleSearch = () => {
    fetchMyBids();
  };
  return (
    <ProtectedRoute
      requireAuth={true}
      redirectTo="/login"
      requiredClearance={["dev"]}
    >
      <div className="p-6 flex flex-col gap-6">
        <Navbar />
        <h1 className="text-5xl text-center">My Bids</h1>
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
        <div className="flex flex-col gap-0 w-full border border-text2 rounded-xl h-fit">
          <ResultsFoundAndSort
            resultsCount={projects.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          {loading ? (
            <div className="p-6 text-center">Loading your bids...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center">No bids found</div>
          ) : (
            projects.map((project) => (
              <ProjectsList
                key={project.id}
                project={project}
                isMyBids={true}
              />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default MyBids;
