"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, FileSearch } from "lucide-react";
import { searchBlogs } from "@/service/supportService";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  // 🚀 Debounced real-time search handler
  const fetchSearchResults = async (query: string) => {
    try {
      const res = await searchBlogs(encodeURIComponent(query));
      const data = res.data.map((item: any) => {
        return {
          url: `/help-center/support/${item?.sub_category?.category?.slug}/${item?.sub_category?.slug}/${item.slug}`,
          label: item?.question,
          category: item.sub_category?.category?.name,
          subCategory: item.sub_category?.name,
        };
      });

      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Searching...</div>;
  }
  return (
    <div className="container mx-auto px-2 sm:px-0 ">
      <h1 className="text-2xl font-bold mb-4">Search results for "{query}"</h1>
      {searchResults.length === 0 && (
        <div className="w-full h-96 flex flex-col justify-center items-center">
          <FileSearch size={100} className="text-gray-400" />
          <p className="font-semibold text-xl text-gray-400">
            No Results found!
          </p>
        </div>
      )}
      <div className="bg-white border rounded-[10px] shadow">
        {searchResults.map((result: any, index: number) => (
          <Link key={index} href={result.url}>
            <div className="p-4 rounded-lg  hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText
                  size={15}
                  className=" text-blue-500 mt-0.5 flex-shrink-0"
                />

                <h3 className="font-medium text-blue-600 hover:underline text-xs">
                  {result.label}
                  {!result.label?.trim().endsWith("?") && "?"}
                </h3>
                <p className="text-xs bg-blue-50  text-blue-500 p-2 rounded">
                  {result.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
