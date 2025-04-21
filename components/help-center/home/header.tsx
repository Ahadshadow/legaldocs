// components/home/header.tsx

"use client";

import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function Header() {
  useEffect(() => {
    // Set font globally if not already in your _app.tsx or layout.tsx
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <header
      className="container-fluid px-0 fw-nav-wrapper hc_header home"
      style={{
        backgroundColor: "#fff",
        width: "100%",
        height: "96px",
        fontFamily: '"Source Sans Pro",',
        fontSize: "16px",
      }}
    >
      <div className="flex justify-between items-center h-full px-12">
        <div className="font-bold text-3xl">
          <Link href="/">legaltemplates.</Link>
        </div>
        <div>
          <Link href="/help-center" className="text-blue-600 hover:underline">
            <span className="hidden sm:inline-block"> Help Center</span>
            <HelpCircle className="d-block sm:hidden" />
          </Link>
        </div>
      </div>
    </header>
  );
}
