"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProfileSection from "../../components/ProfileSection";
import { useCurrentUser } from "../../hooks/useCurrentUser";

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
  
  // Use the current user hook
  const { currentUser, loading: userLoading, error: userError } = useCurrentUser();
  
  // Check if current user is the profile owner
  const isOwner = Boolean(currentUser && username && currentUser.username === username);

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

        // Set profile data
        setProfileData(data);

        // Initialize separate arrays
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
  // Demo data for all sections
  // const projectsData = [
  //   {
  //     id: 1,
  //     title: "Project Title 1",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  //     images: [
  //       "https://www.polytec.com.au/img/products/960-960/mercurio-grey.jpg",
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=960&h=960&fit=crop",
  //     ],
  //     links: [
  //       "https://github.com/example/project1",
  //       "https://project1-demo.netlify.app",
  //     ],
  //     linkLabels: ["GitHub Repo", "Live Demo"],
  //   },
  //   {
  //     id: 2,
  //     title: "Project Title 2",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  //     images: [
  //       "https://www.polytec.com.au/img/products/960-960/mercurio-grey.jpg",
  //       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=960&h=960&fit=crop",
  //       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=960&h=960&fit=crop",
  //     ],
  //     links: ["https://project2-demo.vercel.app"],
  //     linkLabels: ["Lorem Ipsum"],
  //   },
  //   {
  //     id: 3,
  //     title: "Project Title 3",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  //     images: [
  //       "https://www.polytec.com.au/img/products/960-960/mercurio-grey.jpg",
  //       "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=960&h=960&fit=crop",
  //       "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=960&h=960&fit=crop",
  //     ],
  //     links: [
  //       "https://www.lipsum.com/",
  //       "https://github.com/example/project3",
  //       "https://project3-demo.herokuapp.com",
  //     ],
  //     linkLabels: ["Lorem Ipsum", "GitHub Repo", "Live Demo"],
  //   },
  // ];

  // const workData = [
  //   {
  //     id: 1,
  //     title: "Senior Frontend Developer",
  //     company: "TechCorp Solutions",
  //     startDate: "Jan 2023",
  //     endDate: "Present",
  //     description:
  //       "Led a team of 5 developers in building responsive web applications using React and TypeScript. Implemented modern UI/UX designs and improved application performance by 40%.",
  //     proofLink: "https://techcorp.com/team/john-doe",
  //   },
  //   {
  //     id: 2,
  //     title: "Full Stack Developer",
  //     company: "StartupXYZ",
  //     startDate: "Jun 2021",
  //     endDate: "Dec 2022",
  //     description:
  //       "Developed and maintained web applications using Node.js, React, and MongoDB. Built RESTful APIs and collaborated with product teams to deliver features on tight deadlines.",
  //     proofLink: "https://startupxyz.com/about",
  //   },
  //   {
  //     id: 3,
  //     title: "Software Developer Intern",
  //     company: "Digital Innovations Inc",
  //     startDate: "May 2020",
  //     endDate: "Aug 2020",
  //     description:
  //       "Assisted in developing mobile applications using React Native. Participated in code reviews, testing, and documentation. Gained experience in agile development methodologies.",
  //     proofLink: "https://digitalinnovations.com/internship-program",
  //   },
  // ];

  // const educationData = [
  //   {
  //     id: 1,
  //     degree: "Bachelor of Science in Computer Science",
  //     institution: "University of Example",
  //     startDate: "Sep 2018",
  //     endDate: "Jun 2022",
  //     score: "3.8",
  //     maxScore: "4.0",
  //     proofLink: "https://universityofexample.com/diploma/john-doe",
  //   },
  //   {
  //     id: 2,
  //     degree: "Master of Science in Software Engineering",
  //     institution: "Tech University",
  //     startDate: "Sep 2022",
  //     endDate: "Present",
  //     score: "N/A",
  //     maxScore: "4.0",
  //     proofLink: "https://techuniversity.com/diploma/john-doe",
  //   },
  // ];

  // const certificationData = [
  //   {
  //     id: 1,
  //     title: "Certified React Developer",
  //     issuingOrganization: "React Training",
  //     startDate: "Jan 2021",
  //     endDate: "Mar 2021",
  //     description:
  //       "Completed an intensive course on React.js and its ecosystem.",
  //     proofLink: "https://reacttraining.com/certificates/john-doe",
  //   },
  //   {
  //     id: 2,
  //     title: "AWS Certified Solutions Architect",
  //     issuingOrganization: "Amazon Web Services",
  //     startDate: "Apr 2021",
  //     endDate: "Jun 2021",
  //     description:
  //       "Achieved certification in designing distributed systems on AWS.",
  //     proofLink:
  //       "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
  //   },
  //   {
  //     id: 3,
  //     title: "Full Stack Web Development",
  //     issuingOrganization: "Coding Bootcamp",
  //     startDate: "Jul 2021",
  //     endDate: "Sep 2021",
  //     description: "Completed a bootcamp in full stack web development.",
  //     proofLink: "https://codingbootcamp.com/certificates/john-doe",
  //   },
  // ];

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
              {profileData.dob && formatDate(profileData.dob)}
              {profileData.dob && profileData.location && " | "}
              {profileData.location}
              {(profileData.dob || profileData.location) &&
                profileData.gender &&
                " | "}
              {profileData.gender && formatGender(profileData.gender)}
            </p>
            {profileData.skills && profileData.skills.length > 0 && (
              <p>{profileData.skills.join(" | ")}</p>
            )}
            <p>
              Welcome to {profileData.name || profileData.username}'s profile!
              {profileData.clearance === "dev"
                ? " Check out their portfolio and experience below."
                : " Browse their projects and reviews."}
            </p>
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
    </div>
  );
}

export default Profile;
