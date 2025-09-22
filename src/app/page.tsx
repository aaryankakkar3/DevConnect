"use client";

import Navbar from "./components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", color: "white" }}>
        <h1>DevConnect</h1>
        <p>Welcome to your developer network</p>
      </div>
    </div>
  );
}

export default page;
