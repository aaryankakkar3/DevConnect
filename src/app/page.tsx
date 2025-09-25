"use client";

import Navbar from "./components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="p-6">
      <Navbar />
    </div>
  );
}

export default page;
