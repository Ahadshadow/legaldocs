"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, X, ArrowRight, Menu } from "lucide-react";
import { useState } from "react";

interface Template {
  id: string;
  category: "BUSINESS" | "REAL ESTATE" | "PERSONAL";
  title: string;
  description?: string;
}

const templates: Template[] = [
  { id: "1", category: "BUSINESS", title: "Lease/Rental Agreement" },
  { id: "2", category: "REAL ESTATE", title: "Room Rental Agreement" },
  { id: "3", category: "BUSINESS", title: "Lease Termination" },
  { id: "4", category: "BUSINESS", title: "Non-Disclosure and Confidentiality Agreement" },
  { id: "5", category: "BUSINESS", title: "Construction Contract Agreement" },
  { id: "6", category: "BUSINESS", title: "Limited Liability Company (LLC) Operating Agreement" },
  { id: "7", category: "PERSONAL", title: "Child Support Modification" },
  { id: "8", category: "PERSONAL", title: "Cohabitation Agreement" },
  { id: "9", category: "PERSONAL", title: "Affidavit of Gift" },
];

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateModal({ open, onClose }: TemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Choose Template</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div
            className={`w-64 border-r p-4 space-y-4 bg-gray-50 md:relative md:translate-x-0 absolute inset-y-0 left-0 transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-200 ease-in-out`}
          >
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Documents"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${
                  !selectedCategory ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Documents
              </button>
              <div className="pt-2">
                <button
                  onClick={() => setSelectedCategory("BUSINESS")}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${
                    selectedCategory === "BUSINESS" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  BUSINESS
                </button>
                <button
                  onClick={() => setSelectedCategory("REAL ESTATE")}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${
                    selectedCategory === "REAL ESTATE" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  REAL ESTATE
                </button>
                <button
                  onClick={() => setSelectedCategory("PERSONAL")}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${
                    selectedCategory === "PERSONAL" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  PERSONAL
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto transition-all duration-200 ease-in-out">
            <div className="flex items-center mb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                className="md:hidden p-2 bg-white rounded-md shadow-md mr-2"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h2 className="text-lg font-semibold">Popular Documents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-4">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-600">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="font-medium">{template.title}</h3>
                  <div className="space-y-2">
                    <button className="text-sm text-blue-600">Learn More</button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Document
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
