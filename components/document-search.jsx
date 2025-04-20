"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { searchDocuments } from "../service/generalService";
import debounce from "lodash.debounce";

export default function DocumentSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (text) => {
    setLoading(true);
    try {
      const res = await searchDocuments(keyword, { search_document: true });
      const data =
        res.data?.documents?.map((item) => {
          return {
            label: item?.name,
            url: `/app/pdf-builder/documents/${item?.slug}`,
          };
        }) || [];
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((val) => {
    if (isOpen) fetchResults(val);
  }, 1000);

  useEffect(() => {
    handleSearch(keyword);
    return () => handleSearch.cancel();
  }, [keyword]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Search className="h-5 w-5" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed z-50 top-20 w-full max-w-md left-1/2 -translate-x-1/2 rounded-xl shadow-2xl bg-white p-5 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search Documents</h2>
            <Dialog.Close asChild>
              <button>
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <Input
            autoFocus={true}
            placeholder="Search documents (e.g. lease agreement)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mb-4"
          />

          {loading ? (
            <p className="text-sm text-gray-500">Searching...</p>
          ) : results.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-auto">
              {results.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.url}
                    className="flex items-center text-blue-600 underline hover:text-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 transform -rotate-45" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            keyword && (
              <p className="text-sm text-gray-400">No results found.</p>
            )
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
