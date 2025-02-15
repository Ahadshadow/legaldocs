"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, X, Menu } from "lucide-react";
import { getCategories, getTemplatesByCategory } from "../service/navigationService";
import { CreateDocumentButton } from "../components/create-documents-buttons";

interface Category {
  _id: string;
  name: string;
}

interface Template {
  _id: string;
  name: string;
  description?: string;
  subcategory_ids?: string[];
  subcategory_names?: string[];
}

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateModal({ open, onClose }: TemplateModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const categoryResponse = await getCategories();
        const categoryList: Category[] = categoryResponse?.data || [];
        setCategories(categoryList);

        // Set default selected category to "Business" (if exists)
        const businessCategory = categoryList.find((cat) => cat.name === "Business");
        setSelectedCategory(businessCategory?._id || categoryList[0]?._id || null);

        if (businessCategory) {
          const templateResponse = await getTemplatesByCategory(businessCategory._id);
          setTemplates(templateResponse?.data || []);
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [open]);

  useEffect(() => {
    if (selectedCategory) {
      async function fetchTemplates() {
        setIsLoading(true);
        try {
          const templateResponse = await getTemplatesByCategory(selectedCategory);
          setTemplates(templateResponse?.data || []);
        } catch (err) {
          setError("Failed to load templates");
        } finally {
          setIsLoading(false);
        }
      }

      fetchTemplates();
    }
  }, [selectedCategory]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleCreateDocument = (subcategoryId: string) => {
    if (!subcategoryId) {
      console.error("No subcategory ID provided.");
      return;
    }
    router.push(`/app/pdf-builder/documents/${subcategoryId}`);
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Choose Template</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex h-[600px]">
          {/* Sidebar (Categories) */}
          <div className={`w-64 border-r p-4 bg-gray-50 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search Documents"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading &&
              categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md ${
                    selectedCategory === category._id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
          </div>

          {/* Templates List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center mb-4">
              <button onClick={toggleSidebar} className="md:hidden p-2 bg-white rounded-md shadow-md mr-2">
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h2 className="text-lg font-semibold">{selectedCategory ? "Templates" : "Select a Category"}</h2>
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template._id} className="border rounded-lg p-4 flex flex-col h-full">
                  {/* Category Badge (Top Left) */}
                  <div className="text-left">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-600">
                      {template.subcategory_names?.[0] || "Unknown Category"}
                    </span>
                  </div>

                  {/* Template Name (Centered Vertically) */}
                  <div className="flex-1 flex items-center">
                    <h3 className="font-medium text-left text-lg">{template.name}</h3>
                  </div>

                  {/* Create Document Button (Bottom Left) */}
                  <CreateDocumentButton
                    className={"class"}
                    onClick={() => handleCreateDocument(template._id)}
                  />
                </div>
              ))}
            </div>

            {!isLoading && filteredTemplates.length === 0 && (
              <p className="text-gray-500 text-center mt-6">No templates found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
