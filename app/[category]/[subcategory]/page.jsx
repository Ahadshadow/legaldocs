"use client";

import { useState, useEffect, use } from "react";
import { ChevronRight, ChevronDown, Search, LightbulbIcon } from "lucide-react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { CreateDocumentButton } from "../../../components/create-documents-buttons";
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue,
} from "../../../components/ui/custom-select";
import { SC } from "../../../service/Api/serverCall";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { getSubcategoriesByCategoryId } from "../../../service/navigationService";
import { Button } from "../../../components/ui/button";

// Separate DocumentItem component
function DocumentItem({ title, id }) {
  return (
    <div className="p-6 hover:bg-gray-50">
      <h2 className="mb-2 text-lg font-medium">
        <Link
          href={`/app/pdf-builder/documents/${id}`}
          className="text-gray-900 hover:text-primary"
        >
          {title}
        </Link>
      </h2>
    </div>
  );
}

export default function SubcategoryPage({ params }) {
  const { category, subcategory } =use(params);

  const [options, setOptions] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const searchParams = useSearchParams();
  const isViewAll = searchParams.get("viewAll") === "true";
  const subcategoryId = searchParams.get("subcategoryId");
  const router = useRouter();
  const [filteredOption, setFilteredOption] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null); // To track open FAQ items
  const [activeSection, setActiveSection] = useState("Business Formation");
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [subLoading, setSubLoading] = useState(false);

  const categoryId = subcategory.replace(/-/g, " ");

  // console.log("subcategory", subcategory);

  useEffect(() => {
    async function fetchSubcategories() {
      if (isViewAll) {
        // setSubLoading(true)
        try {
          const response = await getSubcategoriesByCategoryId(categoryId);
          if (response && response.status) {
            setSubcategories(response.data || []);
          } else {
            setSubcategories([]);
          }
        } catch (err) {
          console.error("Error loading subcategories:", err);
          setSubcategories([]);
          setError("Failed to load subcategories");
        }
        setSubLoading(false);
      } else {
        setSubcategories([]);
      }
    }
    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await SC.getCall({ url: `documents/${subcategory}` });
        if (response.status) {
          setOptions(response.data.data.length > 0 ? response.data.data : []);
          setSelectedId(response.data.data[0]?.slug);
        } else {
          console.error("Failed to fetch options:", response.message);
          setOptions([]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      }
    }

    if (subcategory) {
      setOptions(null);
      fetchOptions();
    }
  }, [subcategory]);

  const handleCreateDocument = () => {
    if (!selectedId) {
      console.error("No document selected.");
      return;
    }
    router.push(`/app/pdf-builder/documents/${selectedId}`);
  };

  useEffect(() => {
    if (options && selectedId) {
      const selectedOption = options.find(
        (option) => option.slug === selectedId
      );
      setFilteredOption(selectedOption || null);
    }
  }, [selectedId, options]);

  // FAQ Data
  const faqItems = [
    {
      question: "What is a lease agreement?",
      answer:
        "A lease agreement is a contract between a landlord and tenant outlining the rental terms for a property.",
    },
    {
      question: "Can I edit my lease agreement template?",
      answer:
        "Yes! Our templates are customizable. You can fill in details and make necessary changes before finalizing.",
    },
    {
      question: "Is this lease agreement legally binding?",
      answer:
        "Yes, once signed by both parties, it becomes legally enforceable.",
    },
    {
      question: "Do I need a lawyer to create a lease agreement?",
      answer:
        "Not necessarily. Our templates are designed to be legally sound, but you may consult a lawyer for additional modifications.",
    },
  ];

  useEffect(() => {
    async function fetchSDocuments() {
      if (isViewAll) {
        // setSubLoading(true)
        try {
          const response = await SC.getCall({
            url: `documents/${activeSection.id}`,
          });
          if (response && response.status) {
            setDocuments(response.data.data || []);
          } else {
            setDocuments([]);
          }
        } catch (err) {
          console.error("Error loading Documents:", err);
          setDocuments([]);
          setError("Failed to load Documents");
        }
        setSubLoading(false);
      } else {
        setDocuments([]);
      }
    }
    fetchSDocuments();
  }, [activeSection]);

  return (
    <>
      {/* Header */}
      {/* <header className="bg-gray-900 text-white p-4 flex justify-center items-center">
        <div className="flex items-center gap-4">
          <p>Would you like to continue working on your Employee Non-Disclosure Agreement?</p>
          <Button className="bg-indigo-500 hover:bg-indigo-600">Continue Editing</Button>
        </div>
      </header> */}

      {/* Main Content */}
      {isViewAll && (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).toLowerCase()}
                  : Legal Documents & Contracts
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  Make Your Legal Document in Minutes.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Document illustration"
                  width={200}
                  height={200}
                  className="text-blue-200"
                />
              </div>
            </div>
          </section>
        </main>
      )}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {!isViewAll && (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-gray-500 mb-12">
              <Link href="/" className="hover:text-gray-900 cursor-pointer">
                LegalTemplates
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/real-estate/${category}`}
                className="hover:text-gray-900 cursor-pointer"
              >
                {category.replace(/-/g, " ")}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span>{subcategory.replace(/-/g, " ")}</span>
            </nav>
            <div className="grid md:grid-cols-[1fr,400px] gap-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-[40px] font-bold text-gray-900 leading-tight">
                    {subcategory.replace(/-/g, " ")} Templates
                  </h1>
                  <p className="text-xl text-gray-600">
                    Use our {subcategory.replace(/-/g, " ")} templates to manage
                    your {category.replace(/-/g, " ")} property.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <CustomSelect
                      value={selectedId || null}
                      onValueChange={(value) => setSelectedId(value)}
                    >
                      <CustomSelectTrigger className="w-full">
                        <CustomSelectValue placeholder="Select a Template" />
                      </CustomSelectTrigger>
                      <CustomSelectContent>
                        {options === null ? (
                          <CustomSelectItem value="loading" disabled>
                            Loading...
                          </CustomSelectItem>
                        ) : options.length > 0 ? (
                          options.map((option) => (
                            <CustomSelectItem
                              key={option._id}
                              value={option.slug}
                            >
                              {option.name}
                            </CustomSelectItem>
                          ))
                        ) : (
                          <CustomSelectItem value="none" disabled>
                            No documents available
                          </CustomSelectItem>
                        )}
                      </CustomSelectContent>
                    </CustomSelect>
                    <CreateDocumentButton onClick={handleCreateDocument} />
                  </div>

                  {/* Frequently Asked Questions Section */}
                  <div style={{ marginTop: " 100px" }}>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Frequently Asked Questions
                    </h2>
                    <div className="mt-4 space-y-4">
                      {faqItems.map((faq, index) => (
                        <div key={index} className="border-b border-gray-300">
                          <button
                            className="w-full flex justify-between items-center py-3 text-lg text-gray-800 font-medium focus:outline-none"
                            onClick={() =>
                              setFaqOpen(faqOpen === index ? null : index)
                            }
                          >
                            {faq.question}
                            <ChevronDown
                              className={`h-5 w-5 transform transition-transform ${
                                faqOpen === index ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {faqOpen === index && (
                            <p className="pb-3 text-gray-600">{faq.answer}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {filteredOption && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 space-y-6">
                    <Image
                      src={`https://legaldocs.unibyts.com/storage/${filteredOption?.image}`}
                      alt={`${subcategory.replace(/-/g, " ")} Preview`}
                      width={600}
                      height={800}
                      className="w-full rounded-lg border border-gray-200"
                    />
                    <CreateDocumentButton
                      fullWidth
                      onClick={handleCreateDocument}
                    />
                  </div>
                </div>
              )}
            </div>{" "}
          </>
        )}

        {isViewAll && (
          <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full border-r md:w-64">
              <nav className="flex flex-col">
                {subLoading ? (
                  <p className="p-4 text-gray-600">Loading...</p>
                ) : subcategories.length > 0 ? (
                  subcategories.map((sub, index) => (
                    <button
                      key={`nav-${index}`}
                      onClick={() =>
                        setActiveSection({ name: sub.name, id: sub._id })
                      }
                      className={`border-l-4 px-6 py-4 font-medium text-left ${
                        activeSection.name === sub.name
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-gray-600">
                    No subcategories available.
                  </p>
                )}
              </nav>
            </aside>

            {/* Main Content */}
            {/* Main Content */}
            <main className="flex-1 p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                </div>
              </div>

              {activeSection && (
                <>
                  <div className="rounded-lg overflow-hidden border">
                    {/* Header */}
                    <div className="bg-[#f0f2fa] p-6">
                      <h1 className="text-2xl font-medium text-gray-600">
                        {activeSection.name}
                      </h1>
                    </div>

                    {/* Document List */}
                    {documents.length > 0 ? (
                      <div className="divide-y">
                        {documents.map((item, index) => (
                          <DocumentItem
                            key={`doc-${index}`}
                            title={item.name}
                            id={item._id}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-gray-600 text-center">
                        No documents available.
                      </div>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </>
  );
}

SubcategoryPage.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
  }).isRequired,
};
