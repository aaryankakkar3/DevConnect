"use client";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Star } from "lucide-react";
import PlaceBidModal from "@/app/components/Project/PlaceBidModal";
import toast from "react-hot-toast";
import ProjectBid from "@/app/components/Project/ProjectBid";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  projectData?: ProjectData;
}

interface ProjectData {
  id: string;
  title: string;
  longDescription: string;
  shortDescription: string;
  budget: string;
  skills: string[];
  bidCount: number;
  client: {
    id: string;
    name: string;
    email: string;
    rating: number;
    ratingCount: number;
  };
}

interface BidData {
  price: number;
  details: string;
  completionTime: number;
  bidTime: Date;
}

interface ProjectBid {
  id: string;
  price: number;
  details: string;
  completionTime: number;
  bidTime: Date;
  bidder: {
    name: string;
    username: string;
    rating: number;
    ratingCount: number;
  };
}

function ProjectPage({ params, projectData: propProjectData }: PageProps) {
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { id } = React.use(params);

  const [projectData, setProjectData] = useState<ProjectData | null>(
    propProjectData || null
  );
  const [loading, setLoading] = useState(!propProjectData); // Only load if no props provided
  const [error, setError] = useState<string | null>(null);

  // Bid state
  const [hasBid, setHasBid] = useState(false);
  const [bidData, setBidData] = useState<BidData | null>(null);
  const [bidLoading, setBidLoading] = useState(false);

  // Project bids state (for clients to view all bids)
  const [projectBids, setProjectBids] = useState<ProjectBid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  const isOwner = currentUser?.id === projectData?.client.id;

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      // Skip fetching if project data is already provided via props
      if (propProjectData) return;

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

    const checkBid = async () => {
      if (currentUser?.clearance !== "dev") return;

      try {
        setBidLoading(true);
        const response = await fetch(`/api/bids/checkifbid?projectId=${id}`);

        if (!response.ok) {
          console.error("Failed to check bid status");
          toast.error("Failed to check your bid status");
          return;
        }

        const data = await response.json();
        setHasBid(data.hasBid);

        if (data.bid) {
          setBidData({
            price: data.bid.price,
            details: data.bid.details,
            completionTime: data.bid.completionTime,
            bidTime: new Date(data.bid.bidTime),
          });
        }
      } catch (err) {
        console.error("Error checking bid:", err);
        toast.error("An error occurred while checking your bid status");
      } finally {
        setBidLoading(false);
      }
    };

    const fetchProjectBids = async () => {
      if (currentUser?.clearance !== "client" || !isOwner) return;

      try {
        setBidsLoading(true);
        const response = await fetch(`/api/bids/projectbids?projectId=${id}`);

        if (!response.ok) {
          console.error("Failed to fetch project bids");
          toast.error("Failed to load project bids");
          return;
        }

        const data = await response.json();
        const formattedBids = data.map((bid: any) => ({
          ...bid,
          bidTime: new Date(bid.bidTime),
        }));
        setProjectBids(formattedBids);
      } catch (err) {
        console.error("Error fetching project bids:", err);
        toast.error("An error occurred while loading project bids");
      } finally {
        setBidsLoading(false);
      }
    };
    if (id) {
      fetchProject();
      if (currentUser?.clearance === "dev") {
        checkBid();
      }
      if (currentUser?.clearance === "client" && isOwner) {
        fetchProjectBids();
      }
    }
  }, [id, currentUser?.clearance, propProjectData, isOwner]);

  // Function to refresh bid data
  const refreshBidData = async () => {
    if (currentUser?.clearance !== "dev") return;

    try {
      setBidLoading(true);
      const response = await fetch(`/api/bids/checkifbid?projectId=${id}`);

      if (!response.ok) {
        console.error("Failed to check bid status");
        return;
      }

      const data = await response.json();
      setHasBid(data.hasBid);

      if (data.bid) {
        setBidData({
          price: data.bid.price,
          details: data.bid.details,
          completionTime: data.bid.completionTime,
          bidTime: new Date(data.bid.bidTime),
        });
      }
    } catch (err) {
      console.error("Error checking bid:", err);
    } finally {
      setBidLoading(false);
    }
  };

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
          <div className="flex flex-row justify-between">
            <h1 className="text-5xl">{projectData.title}</h1>
            <p className="text-5xl text-text2">{projectData.bidCount} bids</p>
          </div>
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
          {currentUser?.clearance == "dev" && hasBid && bidData && (
            <div className="text-center flex flex-col gap-2">
              My Bid
              <div className="bg-bg2 w-full h-fit p-5 rounded-xl text-left">
                <div className="w-full bg-bg1 rounded-xl p-5 flex flex-col gap-3">
                  <div className="text-xl flex flex-row gap-3">
                    <p className="font-semibold text-accent">
                      ${bidData.price}
                    </p>
                    <p className="">{bidData.completionTime} day delivery</p>
                  </div>
                  <p className="">{bidData.details}</p>
                  <p className="">
                    Created at: {bidData.bidTime.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          {currentUser?.clearance == "client" &&
            isOwner &&
            projectBids.length > 0 && (
              <div className="text-center flex flex-col gap-2">
                Bids
                <div className="bg-bg2 w-full h-fit p-5 rounded-xl text-left flex flex-col gap-3">
                  {projectBids.map((bidsInstance) => (
                    <ProjectBid
                      key={bidsInstance.id}
                      bidsInstance={bidsInstance}
                    />
                  ))}
                </div>
              </div>
            )}
          {currentUser?.clearance == "client" && isOwner && bidsLoading && (
            <div className="text-center flex flex-col gap-2">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          )}
          {currentUser?.clearance == "dev" && !hasBid && !bidLoading && (
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
            onClose={() => {
              setIsBidModalOpen(false);
              refreshBidData(); // Refresh bid data after modal closes
            }}
            projectId={projectData.id}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default ProjectPage;
