"use client";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Star } from "lucide-react";
import PlaceBidModal from "@/app/components/Project/PlaceBidModal";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ProjectData {
  id: string;
  title: string;
  longDescription: string;
  shortDescription: string;
  budget: string;
  skills: string[];
  client: {
    id: string;
    name: string;
    email: string;
    rating: number;
    ratingCount: number;
  };
}

function ProjectPage({ params }: PageProps) {
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { id } = React.use(params);

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Project not found");
          } else {
            setError("Failed to fetch project data");
          }
          return;
        }

        const data = await response.json();
        setProjectData(data);
      } catch (err) {
        setError("An error occurred while fetching project data");
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const bid = {
    bidder: {
      name: "Aaryan Kakkar",
      rating: 4.8,
      ratingCount: 15,
      username: "aaryan_kakkar",
      profilePicture:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fprofile%2520picture%2F&psig=AOvVaw3MaNL3OSjOP8CDMSk8VXXX&ust=1759397091274000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPiNkIfXgpADFQAAAAAdAAAAABAE",
    },
    price: "500",
    bidTime: new Date("2003-10-15T14:30:00"),
    details:
      "Hello, I am interested in your project and would like to bid on it. Hello, I am interested in your project and would like to bid on it. Hello, I am interested in your project and would like to bid on it. Hello, I am interested in your project and would like to bid on it. Hello, I am interested in your project and would like to bid on it. Hello, I am interested in your project and would like to bid on it. Hello, I am interested in your project and would like to bid on it.",
    completionTime: 5,
  };

  const isOwner = currentUser?.id === projectData?.client.id;
  const ifBidded = false;

  function BudgetSkillsComponent() {
    if (!projectData) return null;

    return (
      <div className="flex flex-col gap-4 w-full">
        <label className="flex flex-col gap-2">
          Approximate Budget ($)
          <div className="p-5 border border-text2 rounded-xl">
            {projectData.budget}
          </div>
        </label>
        <label className="flex flex-col gap-2">
          Required Skills
          <div className="p-5 border border-text2 rounded-xl">
            {projectData.skills.join(", ")}
          </div>
        </label>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} redirectTo="/login">
        <div className="p-6 flex flex-col gap-6">
          <Navbar />
          <div className="flex flex-col gap-4 p-6 border border-text2 rounded-xl">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute requireAuth={true} redirectTo="/login">
        <div className="p-6 flex flex-col gap-6">
          <Navbar />
          <div className="flex flex-col gap-4 p-6 border border-text2 rounded-xl">
            <div className="text-center">
              <h1 className="text-2xl text-red-500 mb-4">Error</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Project not found
  if (!projectData) {
    return (
      <ProtectedRoute requireAuth={true} redirectTo="/login">
        <div className="p-6 flex flex-col gap-6">
          <Navbar />
          <div className="flex flex-col gap-4 p-6 border border-text2 rounded-xl">
            <div className="text-center">
              <h1 className="text-2xl text-gray-500 mb-4">Project Not Found</h1>
              <p className="text-gray-600">
                The project you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      <div className="p-6 flex flex-col gap-6">
        <Navbar />
        <div className="flex flex-col gap-4 p-6 border border-text2 rounded-xl">
          <h1 className="text-5xl">{projectData.title}</h1>
          {isOwner ? (
            <BudgetSkillsComponent />
          ) : (
            <div className="flex flex-row gap-8">
              <BudgetSkillsComponent />
              <label className="flex flex-col gap-2 w-60">
                Client
                <div className="flex flex-col gap-1 border border-text2 flex-1 rounded-xl justify-center items-start p-5">
                  <p>{projectData.client.name}</p>
                  <div className="flex flex-row gap-1 items-center">
                    <div className="flex flex-row gap-0 items-center">
                      {projectData.client.rating}
                      <Star className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    ({projectData.client.ratingCount})
                  </div>
                </div>
              </label>
            </div>
          )}
          <label className="flex flex-col gap-2">
            Long description
            <div className="p-5 border border-text2 rounded-xl">
              {projectData.longDescription}
            </div>
          </label>
          {isOwner && (
            <label className="flex flex-col gap-2">
              Short description
              <div className="p-5 border border-text2 rounded-xl">
                {projectData.shortDescription}
              </div>
            </label>
          )}
          {/* Conditional to ifBidded */}
          {currentUser?.clearance == "dev" && ifBidded && (
            <div className="text-center flex flex-col gap-2">
              My Bid
              <div className="bg-bg2 w-full h-fit p-5 rounded-xl text-left">
                <div className="w-full h-50 bg-bg1 rounded-xl p-5 flex flex-col gap-3">
                  <div className="text-xl flex flex-row gap-3">
                    <p className="font-semibold">${bid.price}</p>
                    <p className="">{bid.completionTime} day delivery</p>
                  </div>
                  <p className="">{bid.details}</p>
                  <p className="">Created at: {bid.bidTime.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          {currentUser?.clearance == "dev" && !ifBidded && (
            <button
              onClick={() => {
                setIsBidModalOpen(true);
              }}
              className="rounded-xl bg-accent hover:opacity-70 text-bg1 text-center py-4 px-8 cursor-pointer"
            >
              Place a bid
            </button>
          )}
        </div>
        {isBidModalOpen && (
          <PlaceBidModal
            onClose={() => setIsBidModalOpen(false)}
            projectId={projectData.id}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default ProjectPage;
