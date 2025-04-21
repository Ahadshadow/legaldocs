"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Loader } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { searchDocuments } from "../service/generalService";
import Link from "next/link";
import debounce from "lodash/debounce";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced API call
  const fetchData = async (keyword) => {
    try {
      setLoading(true);
      const res = await searchDocuments(keyword, {
        search_document: true,
        search_subcategory: true,
      });
      const mergedRes = [...res.data?.documents, ...res.data?.subcategories];
      const data =
        mergedRes?.map((item) => {
          const isDocument = !!item?.sub_Categories;
          return {
            label: item?.name,
            url: isDocument
              ? `/app/pdf-builder/documents/${item?.slug}`
              : `/${item?.category?.slug}/${item?.slug}`,
          };
        }) || [];
      setState(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchData
  const debouncedFetch = useCallback(
    debounce((value) => {
      fetchData(value);
    }, 1000),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value);
  };
  const FieldIcon = loading ? Loader : Search;
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Find Your Document</h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search documents and forms (e.g. lease agreement)"
                className="w-full pl-4 pr-10 py-3"
                value={query}
                onChange={handleInputChange}
              />
              <FieldIcon
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5`}
              />
            </div>
            <Button
              className="bg-[#6B7CFF] hover:bg-[#5A6AE6]"
              onClick={() => fetchData(query)}
            >
              Search
            </Button>
          </div>

          {!loading && state.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {state.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Link
                    href={item.url}
                    className="text-[#6B7CFF] hover:underline"
                  >
                    {item.label}
                  </Link>
                  {index < state.length - 1 && (
                    <span className="text-gray-400">|</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
