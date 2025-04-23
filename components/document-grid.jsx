"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Home,
  FileText,
  TrendingUp,
  Tag,
  FileCheck,
} from "lucide-react";
import { SC } from "../service/Api/serverCall";
import { getCategories } from "../service/navigationService";
import Link from "next/link";

const defaultIcons = [Building2, Home, FileText, TrendingUp, Tag, FileCheck];

export default function DocumentGrid() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubCato, setIsSubCato] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchSubmissions = async () => {
    try {
      const response = await SC.getCall({ url: `getRandomSubCategories` });
      if (response.status) {
        setIsSubCato(response.data?.data || []);
      } else {
        throw new Error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = (event, href) => {
  
      router.push(href);
  };
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl justify-items-center">
        {isSubCato.map((sub, index) => {
          const Icon = defaultIcons[index % defaultIcons.length];
          const href = `/${sub?.category?.slug || "business"}/${sub.slug}`;

          return (
            <Link
              key={sub._id}
              href={href}
              onClick={(e) => handleClick(e, href)}
              className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:border-[#6B7CFF] transition-colors cursor-pointer min-w-[130px]"
            >
              <Icon className="h-8 w-8 text-[#6B7CFF] mb-3" />
              <span className="text-sm text-center text-gray-600">
                {sub.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
