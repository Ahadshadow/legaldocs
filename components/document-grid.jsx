"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Home, FileText, TrendingUp, Tag, FileCheck } from "lucide-react";
import Link from "next/link";

const documents = [
  { title: "Lease Agreement", icon: Building2, href: "/real-estate/leases" },
  { title: "Eviction Notice", icon: Home, href: "/eviction" },
  { title: "Non-Disclosure Agreement", icon: FileText, href: "/nda" },
  { title: "Power of Attorney", icon: TrendingUp, href: "/power-of-attorney" },
  { title: "Bill of Sale", icon: Tag, href: "/bill-of-sale" },
  { title: "Last Will", icon: FileCheck, href: "/last-will" },
];

export default function DocumentGrid() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token); // Convert token existence to boolean
  }, []);

  const handleClick = (event, href) => {
    if (!isAuthenticated) {
      event.preventDefault(); // Prevent default navigation
      router.push("/signin"); // Redirect to sign-in page
    } else {
      router.push(href); // Allow navigation if authenticated
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
      {documents.map((doc) => (
        <a
          key={doc.title}
          href={doc.href}
          onClick={(e) => handleClick(e, doc.href)}
          className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:border-[#6B7CFF] transition-colors cursor-pointer"
        >
          <doc.icon className="h-8 w-8 text-[#6B7CFF] mb-3" />
          <span className="text-sm text-center text-gray-600">{doc.title}</span>
        </a>
      ))}
    </div>
  );
}
