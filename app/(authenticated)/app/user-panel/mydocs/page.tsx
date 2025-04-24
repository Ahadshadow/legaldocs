"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/tablePanel";
import Layout from "../../../../../components/layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { Pencil, Plus, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { TemplateModal } from "../../../../../components/template-dialog";
import { UploadDialog } from "../../../../../components/upload-dialog";
import { SC } from "../../../../../service/Api/serverCall";
import { useAuth } from "../../../../../hooks/useAuth";
import { getUserData } from "../../../../../lib/utils";

const GlobalStyles = () => (
  <style jsx global>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

export default function DocumentsPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("All Documents");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState<{
    email: string;
    name?: string;
  } | null>(null);
  const { isLoggedIn } = useAuth();
  const [isEmailMatch, setIsEmailMatch] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const tabs = [
    "All Documents",
    // "Draft",
    // "Actions Required",
    // "Waiting for Others",
    // "Completed",
    // "Declined",
    // "Cancelled",
  ];

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const response = await SC.getCall({ url: "get/submissions" });
        if (response.status) {
          setSubmissions(response.data.submissions);
        } else {
          throw new Error("Failed to fetch submissions");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const data = getUserData();
      setUserData(data);
      console.log(data.email, "data.email");
    } else {
      setUserData(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userData?.email && submissions) {
      const userEmail = userData.email.trim().toLowerCase();

      // Normalize signature emails
      const signatureEmails = submissions.map((submission) =>
        submission.signatureRequestEmail?.trim().toLowerCase()
      );

      // Check if any of the signature emails match the userEmail
      const match = signatureEmails.some((email) => email === userEmail);

      setIsEmailMatch(match);
    } else {
      console.log("One of the emails is undefined or null");
      setIsEmailMatch(false);
    }
  }, [userData?.email, submissions]);

  const filteredSubmissions = submissions.filter((submission) => {
    switch (currentTab) {
      case "All Documents":
        return true;
      // case "Draft":
      //   return submission.status === "draft";
      // case "Actions Required":
      //   return submission.status === "pending";
      // case "Waiting for Others":
      //   return submission.status === "waiting";
      // case "Completed":
      //   return submission.status === "completed";
      // case "Declined":
      //   return submission.status === "declined";
      // case "Cancelled":
      //   return submission.status === "cancelled";
      default:
        return false;
    }
  });

  const handlePDFEditorClick = useCallback(
    (submissionId) => {
      router.push(
        `/app/document-editor/documents/${submissionId}`
      );
    },
    [router]
  );
  
  const handleSmartEditorClick = useCallback(
    (submission) => {
      router.push(
        `/app/pdf-builder/documents/${submission.document.slug}?submission_id=${submission.submission_id}` 
      );
    },
    [router]
  );
  
  return (
    <Layout>
      <GlobalStyles />
      <TemplateModal open={isModalOpen} onClose={closeModal} />
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      {/* Premium Banner */}
      <div className="mb-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 flex items-center justify-center gap-2">
        <svg
          className="h-5 w-5 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-blue-600">
          Try premium features for free.{" "}
          <Link href="/pricing" className="font-medium underline">
            Upgrade now
          </Link>
        </p>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{currentTab}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={openModal}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Choose Template</span>
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Upload File</span>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b overflow-x-auto scrollbar-hide">
        <nav className="-mb-px flex" aria-label="Tabs">
          <ul className="flex whitespace-nowrap">
            {tabs.map((tab, index) => (
              <li key={tab} className={index === tabs.length - 1 ? "pr-8" : ""}>
                <button
                  onClick={() => setCurrentTab(tab)}
                  className={`${
                    currentTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium mx-4`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Documents Table */}
      <div className="rounded-lg border bg-white overflow-x-auto scrollbar-hide">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading documents...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">Error: {error}</div>
        ) : (
          <Table className="scrollbar-hide">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-500">
                  Name
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500">
                  Last Updated
                  <svg
                    className="ml-1 inline-block h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.submission_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {submission.document.name}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {submission.status}
                    </TableCell>
                    <TableCell>
                      {new Date(submission.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="inline-flex rounded border border-gray-200 [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none">
                            <Button
                              variant="ghost"
                              className="bg-white hover:bg-gray-50 h-8 px-3 text-sm font-normal text-gray-700"
                            >
                              {submission.status === "Complete"
                                ? "Download"
                                : submission.status === "Waiting for E-Sign" &&
                                  isEmailMatch
                                ? "E-sign"
                                : "Edit"}
                            </Button>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handlePDFEditorClick(submission.submission_id)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>{isEmailMatch ? "Show Document" : "Document Editor"} </span>
                          </DropdownMenuItem>
                          {
                             (!isEmailMatch  && submission?.status != "Complete") &&  <DropdownMenuItem
                             onClick={() =>
                               handleSmartEditorClick(submission)
                             }
                           >
                             <Pencil className="mr-2 h-4 w-4" />
                             <span>Smart Editor</span>
                           </DropdownMenuItem>
                          }
                         
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    No documents found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
}
