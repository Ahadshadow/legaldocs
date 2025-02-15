"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from 'lucide-react';
import PropTypes from 'prop-types';
import { CreateDocumentButton } from "../../../../components/create-documents-buttons";
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue,
} from "../../../../components/ui/custom-select";
import { SC } from "../../../../service/Api/serverCall";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubcategoryPage({ params }) {
  const { category, subcategory } = params;
  const [options, setOptions] = useState(null); // null indicates loading state
  const [selectedId, setSelectedId] = useState(null); // Store selected ID
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("subcategoryId");
  const router = useRouter(); // Initialize router

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await SC.getCall({ url: `documents/${subcategoryId}` });

        if (response.status) {
          setOptions(response.data.data.length > 0 ? response.data.data : []); // Set empty array if no documents
        } else {
          console.error("Failed to fetch options:", response.message);
          setOptions([]); // Ensure empty state if there's an error
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]); // Handle network errors gracefully
      }
    }

    if (subcategoryId) {
      setOptions(null); // Reset to loading state on subcategory change
      fetchOptions();
    }
  }, [subcategoryId]);

  const handleCreateDocument = () => {
    if (!selectedId) {
      console.error("No document selected.");
      return;
    }
    router.push(`/app/pdf-builder/documents/${selectedId}`); 
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      {/* <nav className="flex items-center gap-1 text-sm text-gray-500 mb-12">
        <Link href="/" className="hover:text-gray-900 cursor-pointer">
          LegalTemplates
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/real-estate" className="hover:text-gray-900 cursor-pointer">
          Real Estate
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/real-estate/${category}`} className="hover:text-gray-900 cursor-pointer">
          {category.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span>{subcategory.replace(/-/g, " ")}</span>
      </nav> */}

      <div className="grid md:grid-cols-[1fr,400px] gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-[40px] font-bold text-gray-900 leading-tight">
              {subcategory.replace(/-/g, " ")} Templates
            </h1>
            <p className="text-xl text-gray-600">
              Use our {subcategory.replace(/-/g, " ")} to manage your {category.replace(/-/g, " ")} property.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <CustomSelect onValueChange={(value) => setSelectedId(value)}>
                <CustomSelectTrigger className="w-full">
                  <CustomSelectValue placeholder="Select a Template" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  {options === null ? (
                    <CustomSelectItem value="loading" disabled>Loading...</CustomSelectItem>
                  ) : options.length > 0 ? (
                    options.map((option) => (
                      <CustomSelectItem key={option._id} value={option._id}>
                        {option.name}
                      </CustomSelectItem>
                    ))
                  ) : (
                    <CustomSelectItem value="none" disabled>No documents available</CustomSelectItem>
                  )}
                </CustomSelectContent>
              </CustomSelect>
              <CreateDocumentButton onClick={handleCreateDocument} />
            </div>
          </div>
{/* 
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Updated August 12, 2024</p>
            <p className="text-sm text-gray-500">
              Written by{" "}
              <a href="#" className="text-[#4b62f9] hover:underline">
                Jana Freer
              </a>{" "}
              | Reviewed by{" "}
              <a href="#" className="text-[#4b62f9] hover:underline">
                Susan Chai, Esq.
              </a>
            </p>
          </div> */}

          <div>
            <p className="text-gray-600 leading-relaxed">
              A <span className="text-gray-900">{subcategory.replace(/-/g, " ")}</span> is a legally binding contract that outlines the obligations and rights of the
              parties involved. It establishes the terms of the agreement and helps you avoid disputes and address issues when they arise.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt={`${subcategory.replace(/-/g, " ")} Preview`}
              width={600}
              height={800}
              className="w-full rounded-lg border border-gray-200"
            />
            <CreateDocumentButton fullWidth onClick={handleCreateDocument} />
            {/* <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-gray-900">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#4b62f9] text-[#4b62f9]" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">29,272 Ratings</span>
              </div>
              <div className="text-sm text-gray-500">409,178 Downloads</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

SubcategoryPage.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
  }).isRequired,
};
