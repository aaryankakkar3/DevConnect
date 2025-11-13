"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

interface User {
  id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  clearance: string;
  dob: Date | null;
  gender: string | null;
  idPhoto: string | null;
  selfieCheckPhoto: string | null;
}

function page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUnapprovedUsers();
  }, []);

  const fetchUnapprovedUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/unapprovedUsers");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/updateVerificationStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status: "verified",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the approved user from the list
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        alert(data.error || "Failed to approve user");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while approving user");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/updateVerificationStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status: "unverified",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the rejected user from the list
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        alert(data.error || "Failed to reject user");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while rejecting user");
    }
  };

  function UserApprovalComponent({ user }: { user: User }) {
    const formatDate = (date: Date | null) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-GB");
    };

    return (
      <div className="w-full h-90 flex flex-col gap-3 p-4 rounded-lg">
        <div className="flex flex-row gap-6 px-30">
          <img
            src={
              user.selfieCheckPhoto ||
              user.profilePicture ||
              "/default-avatar.png"
            }
            alt={user.name}
            className="h-75 w-75 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-3 justify-center">
            <div className="flex flex-row gap-5 text-5xl">
              <p className="">{user.name}</p>
              <p className="text-text2">{user.clearance}</p>
            </div>
            <p className="">
              {formatDate(user.dob)} | {user.gender || "N/A"}
            </p>
            {user.idPhoto && (
              <a
                href={user.idPhoto}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ID Photo
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-6 w-full h-12">
          <button
            onClick={() => handleApprove(user.id)}
            className="flex items-center hover:opacity-70 cursor-pointer justify-center bg-accent text-bg1 w-full h-full"
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(user.id)}
            className="flex items-center border hover:bg-bg2 cursor-pointer justify-center w-full h-full"
          >
            Reject
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} requiredClearance={["admin"]}>
      <div className="p-6 flex flex-col gap-6">
        <Navbar />

        {loading && <p>Loading unapproved users...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-text2">No users pending approval</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="flex flex-col gap-6">
            {users.map((user) => (
              <UserApprovalComponent key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default page;
