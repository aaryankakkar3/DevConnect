"use client";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      <div className="p-6">
        <Navbar />
      </div>
    </ProtectedRoute>
  );
}

export default page;
