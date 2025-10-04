"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return <div className=""></div>;
}

export default page;
