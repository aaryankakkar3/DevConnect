"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProfileSection from "../../components/Profile/ProfileSection";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import EditProfileModal from "@/app/components/Profile/Edit Profile Modals/EditProfileModal";
import ProfileAccountNav from "@/app/components/ProfileAccountNav";
import ProtectedRoute from "@/app/components/ProtectedRoute";

function Profile({ params }: { params: Promise<{ username: string }> }) {
  // State for storing fetched data - separate arrays for each type
  const [profileData, setProfileData] = useState<any>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Use the current user hook
  const {
    currentUser,
    loading: userLoading,
    error: userError,
  } = useCurrentUser();

  // Check if current user is the profile owner
  const isOwner = Boolean(
    currentUser && username && currentUser.username === username
  );

  // Functions to add new data to arrays (optimistic updates)
  const addPortfolioProject = (newProject: any) => {
    setPortfolioProjects((prev) => [newProject, ...prev]);
  };

  const addWorkExperience = (newWork: any) => {
    setWorkExperiences((prev) => [newWork, ...prev]);
  };

  const addEducation = (newEducation: any) => {
    setEducations((prev) => [newEducation, ...prev]);
  };

  const addCertification = (newCert: any) => {
    setCertifications((prev) => [newCert, ...prev]);
  };

  // Functions to handle both add and edit operations
  const handlePortfolioProjectUpdate = (data: any) => {
    if (data?.deleted && data?.id) {
      // Handle deletion
      setPortfolioProjects((prev) => prev.filter((p) => p.id !== data.id));
    } else if (data?.id && portfolioProjects.some((p) => p.id === data.id)) {
      // Update existing project
      setPortfolioProjects((prev) =>
        prev.map((p) => (p.id === data.id ? data : p))
      );
    } else if (data?.id) {
      // Add new project
      setPortfolioProjects((prev) => [data, ...prev]);
    }
  };

  const handleWorkExperienceUpdate = (data: any) => {
    if (data?.deleted && data?.id) {
      // Handle deletion
      setWorkExperiences((prev) => prev.filter((w) => w.id !== data.id));
    } else if (data?.id && workExperiences.some((w) => w.id === data.id)) {
      // Update existing work experience
      setWorkExperiences((prev) =>
        prev.map((w) => (w.id === data.id ? data : w))
      );
    } else if (data?.id) {
      // Add new work experience
      setWorkExperiences((prev) => [data, ...prev]);
    }
  };

  const handleEducationUpdate = (data: any) => {
    if (data?.deleted && data?.id) {
      // Handle deletion
      setEducations((prev) => prev.filter((e) => e.id !== data.id));
    } else if (data?.id && educations.some((e) => e.id === data.id)) {
      // Update existing education
      setEducations((prev) => prev.map((e) => (e.id === data.id ? data : e)));
    } else if (data?.id) {
      // Add new education
      setEducations((prev) => [data, ...prev]);
    }
  };

  const handleCertificationUpdate = (data: any) => {
    if (data?.deleted && data?.id) {
      // Handle deletion
      setCertifications((prev) => prev.filter((c) => c.id !== data.id));
    } else if (data?.id && certifications.some((c) => c.id === data.id)) {
      // Update existing certification
      setCertifications((prev) =>
        prev.map((c) => (c.id === data.id ? data : c))
      );
    } else if (data?.id) {
      // Add new certification
      setCertifications((prev) => [data, ...prev]);
    }
  };

  // Extract username from params
  useEffect(() => {
    const getUsername = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };
    getUsername();
  }, [params]);

  // Fetch profile data for the specific username
  useEffect(() => {
    if (!username) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/profile/${username}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`User with username "${username}" not found`);
          }
          throw new Error("Failed to fetch profile data");
        }

        const result = await response.json();
        const data = result.data;

        setProfileData(data);

        setPortfolioProjects(data.portfolioProjects || []);
        setWorkExperiences(data.workexperiences || []);
        setEducations(data.educations || []);
        setCertifications(data.certifications || []);
        setReviews(data.receivedReviews || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]); // Removed refreshTrigger dependency

  // Show loading state
  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
        <div className="p-10 flex flex-col gap-10">
          <Navbar />
          <div className="flex justify-center items-center h-96">
            <p className="text-text2">Loading profile data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show error state
  if (error) {
    return (
      <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
        <div className="p-10 flex flex-col gap-10">
          <Navbar />
          <div className="flex justify-center items-center h-96">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show not found if no profile data
  if (!profileData) {
    return (
      <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
        <div className="p-10 flex flex-col gap-10">
          <Navbar />
          <div className="flex justify-center items-center h-96">
            <p className="text-text2">Profile not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Format date of birth
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format gender display
  const formatGender = (gender: string) => {
    if (!gender) return "";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const isThisADevProfile = profileData.clearance === "dev";

  return (
    <ProtectedRoute requireAuth={true} requiredVerification={["verified"]}>
      <div className="p-6 flex flex-col gap-6">
        <Navbar />
        <div className="flex flex-col gap-6 items-center">
          {isOwner && <ProfileAccountNav currentPage="Personal Profile" />}
          <div className="flex flex-row gap-12 w-full h-fit px-30 justify-center">
            <div className="w-75 h-75 bg-text2 rounded-full shrink-0 overflow-hidden">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt={`${profileData.name || profileData.username}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-text2"></div>
              )}
            </div>
            <div className="flex flex-col gap-3 w-fit justify-center">
              <div className="flex flex-row gap-5 text-5xl justify-start items-start">
                <p className="">{profileData.name || profileData.username}</p>
                <p className="text-text2">
                  {profileData.clearance === "dev" ? "Developer" : "Client"}
                </p>
              </div>
              <p className="text-text2">
                {[
                  profileData.dob && formatDate(profileData.dob),
                  console.log("DOB:", formatDate(profileData.dob)),
                ]}
                {profileData.dob && profileData.location && " | "}
                {profileData.location}
                {(profileData.dob || profileData.location) &&
                  profileData.gender &&
                  " | "}
                {profileData.gender && formatGender(profileData.gender)}
              </p>
              {profileData.bio && <p>{profileData.bio}</p>}
              {isThisADevProfile &&
                profileData.skills &&
                profileData.skills.length > 0 && (
                  <p>{profileData.skills.join(" | ")}</p>
                )}
              {isOwner && (
                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                  }}
                  className="w-fit text-text2 hover:text-text1 hover:underline cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          {isThisADevProfile && (
            <ProfileSection
              type="Projects"
              data={portfolioProjects}
              onDataUpdate={handlePortfolioProjectUpdate}
              isOwner={isOwner}
            />
          )}
          {isThisADevProfile && (
            <ProfileSection
              type="Work Experience"
              data={workExperiences}
              onDataUpdate={handleWorkExperienceUpdate}
              isOwner={isOwner}
            />
          )}
          {isThisADevProfile && (
            <ProfileSection
              type="Education"
              data={educations}
              onDataUpdate={handleEducationUpdate}
              isOwner={isOwner}
            />
          )}
          {isThisADevProfile && (
            <ProfileSection
              type="Certifications / Courses"
              data={certifications}
              onDataUpdate={handleCertificationUpdate}
              isOwner={isOwner}
            />
          )}
          <ProfileSection
            type="Reviews"
            data={reviews}
            onDataUpdate={() => {}} // Reviews don't have optimistic updates yet
            isOwner={isOwner}
          />
        </div>
        {profileModalOpen && (
          <EditProfileModal
            onClose={() => setProfileModalOpen(false)}
            profileData={profileData}
            setProfileData={setProfileData}
            isThisADevProfile={isThisADevProfile}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default Profile;
