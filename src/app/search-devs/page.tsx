"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import SingleInputField from "../components/Profile/Edit Profile Modals/SingleInputField";
import ResultsFoundAndSort from "../components/ResultsFoundAndSort";
import { Star } from "lucide-react";

interface Developer {
  name: string;
  username: string;
  bio: string;
  location: string;
  skills: string[];
  gender: string;
  dob: string;
  profilePic: string | null;
  rating: number;
  ratingCount: number;
  description: string;
}

function page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-reviewed");
  const [devs, setDevs] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch developers from API
  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        search: searchQuery,
      });

      const response = await fetch(`/api/devs?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch developers");
      }

      const data = await response.json();
      setDevs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setDevs([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery]);

  // Fetch developers on component mount and when sortBy changes
  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  // Handle sort change from ResultsFoundAndSort component
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Handle search button click
  const handleSearch = () => {
    fetchDevelopers();
  };
  return (
    <div className="flex flex-col p-6 gap-6">
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
      <div className="flex flex-col gap-0 w-full border border-text2 rounded-xl h-fit">
        <ResultsFoundAndSort
          resultsCount={devs.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isdevs={true}
        />
        {devs.map((dev) => (
          <div
            key={dev.username}
            className="flex flex-col gap-2 p-6 border-b border-text2"
          >
            <div className="flex flex-row gap-2 text-xl">
              <a
                href={`/profile/${dev.username}`}
                className="text-accent hover:underline"
              >
                {dev.name}
              </a>
              <p className="text-text2">{dev.username}</p>
            </div>
            <p className="">
              {dev.dob} | {dev.location} | {dev.gender}
            </p>
            <p className="font-semibold">{dev.skills.join(" | ")}</p>
            <p className="">{dev.description}</p>
            <div className="flex flex-row gap-1.5 items-center">
              <div className="flex flex-row gap-0.5 items-center">
                {dev.rating}
                <Star className="w-4 h-4" strokeWidth={1.5} />
              </div>
              ({dev.ratingCount})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
