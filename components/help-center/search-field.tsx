"use client";

import { useState, useEffect, FormEvent } from "react";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { searchBlogs } from "@/service/supportService";

interface SearchResult {
  label: string;
  url: string;
}

const SearchField = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResult, setNoResult] = useState<boolean>(false);

  // 🚀 Debounced real-time search handler
  const fetchResults = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    try {
      const res = await searchBlogs(encodeURIComponent(query));
      const data = res.data.map((item: any) => {
        return {
          url: `/help-center/support/${item?.sub_category?.category?.slug}/${item?.sub_category?.slug}/${item.slug}`,
          label: item?.question,
        };
      });
      setResults(data || []);
      setNoResult(!data.length);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Call debounce whenever searchTerm changes
  const debouncedSearch = debounce(fetchResults, 400);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  // 🔁 On form submit → Redirect
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const url = `/help-center/support/search?q=${encodeURIComponent(
        searchTerm
      )}`;
      router.push(url);
    }
  };

  return (
    <div className="max-sm:w-96 max-md:w-[500px] max-lg:w-full mx-auto mt-10 p-4 bg-[#eaf4ff] rounded">
      <form
        onSubmit={handleSubmit}
        className="flex bg-white rounded overflow-hidden border border-[#d5dbe3]"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter the search term here...."
            className="w-full h-12 px-4 pr-10 text-gray-600 focus:outline-none "
          />
        </div>
        <button
          type="submit"
          className="w-[100px] m-1 bg-[#4b62f9] hover:bg-[#3c52d5] text-white flex items-center justify-center rounded"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Search Results */}
      {loading ? (
        <p className="mt-2 text-sm text-gray-500">Searching...</p>
      ) : results.length > 0 ? (
        <ul className="mt-2 space-y-2 max-h-40 overflow-auto bg-white border rounded p-2 shadow">
          {results.map((item, index) => (
            <li key={index}>
              <Link
                href={item.url}
                className="flex items-center text-blue-600 underline hover:text-blue-700"
              >
                <ArrowRight className="h-4 w-4 mr-2 transform -rotate-45" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm &&
        noResult &&
        !loading && (
          <p className="mt-2 text-sm text-gray-400">No results found.</p>
        )
      )}
    </div>
  );
};

export default SearchField;
