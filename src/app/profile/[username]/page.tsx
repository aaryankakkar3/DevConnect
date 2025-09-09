"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProfileSection from "../../components/ProfileSection";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import EditProfileModal from "@/app/components/EditProfileModal";

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
    if (data.id && portfolioProjects.some((p) => p.id === data.id)) {
      // Update existing project
      setPortfolioProjects((prev) =>
        prev.map((p) => (p.id === data.id ? data : p))
      );
    } else {
      // Add new project
      setPortfolioProjects((prev) => [data, ...prev]);
    }
  };

  const handleWorkExperienceUpdate = (data: any) => {
    if (data.id && workExperiences.some((w) => w.id === data.id)) {
      // Update existing work experience
      setWorkExperiences((prev) =>
        prev.map((w) => (w.id === data.id ? data : w))
      );
    } else {
      // Add new work experience
      setWorkExperiences((prev) => [data, ...prev]);
    }
  };

  const handleEducationUpdate = (data: any) => {
    if (data.id && educations.some((e) => e.id === data.id)) {
      // Update existing education
      setEducations((prev) => prev.map((e) => (e.id === data.id ? data : e)));
    } else {
      // Add new education
      setEducations((prev) => [data, ...prev]);
    }
  };

  const handleCertificationUpdate = (data: any) => {
    if (data.id && certifications.some((c) => c.id === data.id)) {
      // Update existing certification
      setCertifications((prev) =>
        prev.map((c) => (c.id === data.id ? data : c))
      );
    } else {
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
      <div className="p-10 flex flex-col gap-10">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-muted">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-10 flex flex-col gap-10">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Show not found if no profile data
  if (!profileData) {
    return (
      <div className="p-10 flex flex-col gap-10">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-muted">Profile not found</p>
        </div>
      </div>
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

  return (
    <div className="p-10 flex flex-col gap-10">
      <Navbar />
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-row gap-3 bg-bglight text-s w-fit h-fit rounded-full">
          <button className="px-20 py-10 rounded-full bg-accent text-bgdark font-semibold">
            Personal Profile
          </button>
          <button className="px-20 py-10 rounded-full hover:bg-accent hover:text-bgdark hover:font-semibold">
            Account Settings
          </button>
        </div>
        <div className="flex flex-row gap-10 w-full h-fit">
          <div className="w-75 h-75 bg-muted rounded-full shrink-0 overflow-hidden">
            {profileData.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt={`${profileData.name || profileData.username}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted"></div>
            )}
          </div>
          <div className="flex flex-col gap-5 w-full justify-center">
            <div className="flex flex-row gap-5 text-l justify-start items-start">
              <p className="">{profileData.name || profileData.username}</p>
              <p className="text-muted">
                {profileData.clearance === "dev" ? "Developer" : "Client"}
              </p>
            </div>
            <p className="text-muted2">
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
            {profileData.skills && profileData.skills.length > 0 && (
              <p>{profileData.skills.join(" | ")}</p>
            )}
            {isOwner && (
              <button
                onClick={() => {
                  setProfileModalOpen(true);
                }}
                className="w-fit text-muted2 hover:text-white hover:underline cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <ProfileSection
          type="Projects"
          data={portfolioProjects}
          onDataUpdate={handlePortfolioProjectUpdate}
          isOwner={isOwner}
        />
        <ProfileSection
          type="Work Experience"
          data={workExperiences}
          onDataUpdate={handleWorkExperienceUpdate}
          isOwner={isOwner}
        />
        <ProfileSection
          type="Education"
          data={educations}
          onDataUpdate={handleEducationUpdate}
          isOwner={isOwner}
        />
        <ProfileSection
          type="Certifications / Courses"
          data={certifications}
          onDataUpdate={handleCertificationUpdate}
          isOwner={isOwner}
        />
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
        />
      )}
    </div>
  );
}

export default Profile;
