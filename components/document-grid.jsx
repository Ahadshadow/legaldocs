"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Home, FileText, TrendingUp, Tag, FileCheck } from "lucide-react";
import { SC } from "../service/Api/serverCall";
import { getCategories } from "../service/navigationService"; 

const defaultIcons = [Building2, Home, FileText, TrendingUp, Tag, FileCheck];

export default function DocumentGrid() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubCato, setIsSubCato] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await SC.getCall({ url: `getRandomSubCategories` });
        if (response.status) {
          console.log("Subcategories fetched:", response.data.data);
          setIsSubCato(response.data.data);
        } else {
          throw new Error("Failed to fetch submissions");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.status) {
          console.log("Categories fetched:", response.data);
          setCategories(response.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSubmissions();
    fetchCategories();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = (event, href) => {
    if (!isAuthenticated) {
      event.preventDefault();
      router.push("/signin");
    } else {
      router.push(href);
    }
  };

  const getCategoryForSubcategory = (subcategory) => {
    const category = categories.find((cat) => cat._id === subcategory.category_id);
    console.log("Matching category for subcategory:", subcategory.name, "->", category);
    return category ? category.name : "unknown-category";
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl justify-items-center">
        {isSubCato.map((sub, index) => {
          const Icon = defaultIcons[index % defaultIcons.length];
          const categorySlug = getCategoryForSubcategory(sub).toLowerCase().replace(/\s+/g, "-");
          const subcategorySlug = sub.name.toLowerCase().replace(/\s+/g, "-");
          const href = `/${categorySlug}/${subcategorySlug}?subcategoryId=${sub._id}`;

          return (
            <a
              key={sub._id}
              href={href}
              onClick={(e) => handleClick(e, href)}
              className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:border-[#6B7CFF] transition-colors cursor-pointer min-w-[130px]"
            >
              <Icon className="h-8 w-8 text-[#6B7CFF] mb-3" />
              <span className="text-sm text-center text-gray-600">{sub.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}