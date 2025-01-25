"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/tablePanel"
import Layout from "../../../../../components/layout"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu"
import {
  ChevronDown,
  Download,
  FileSignature,
  MessagesSquare,
  Pencil,
  Printer,
  Share2,
  Trash2,
  Copy,
  Plus,
  FileText,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { TemplateModal } from "../../../../../components/template-dialog"
import { UploadDialog } from "../../../../../components/upload-dialog"

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
)

export default function DocumentsPage() {
  const [currentTab, setCurrentTab] = useState("All Documents")
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  const tabs = [
    "All Documents",
    "Draft",
    "Actions Required",
    "Waiting for Others",
    "Completed",
    "Declined",
    "Cancelled",
  ]

  return (
    <Layout>
      <GlobalStyles />
      {/* <TemplateDialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen} /> */}
      <TemplateModal open={isModalOpen} onClose={closeModal}/>
      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />

      {/* Premium Banner */}
      <div className="mb-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 flex items-center justify-center gap-2">
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Upload File</span>
            </DropdownMenuItem>
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
        <Table className="scrollbar-hide">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-gray-500">Name</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Last Updated
                <svg className="ml-1 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Owner</TableHead>
              <TableHead className="text-right text-xs font-medium text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTab === "All Documents" ? (
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Lease/Rental Agreement
                  </div>
                </TableCell>
                <TableCell>Draft</TableCell>
                <TableCell>04/01/2025 • 8:57 PM</TableCell>
                <TableCell>You</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="inline-flex rounded border border-gray-200 [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none">
                        <Button
                          variant="ghost"
                          className="bg-white hover:bg-gray-50 h-8 px-3 text-sm font-normal text-gray-700 border-r"
                        >
                          Edit
                        </Button>
                        <Button variant="ghost" className="bg-white hover:bg-gray-50 h-8 px-1.5">
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <FileSignature className="mr-2 h-4 w-4" />
                        <span>E-Sign</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessagesSquare className="mr-2 h-4 w-4" />
                        <span>AI Assistant</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Access</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        <span>Print</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Move to Trash</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No documents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {currentTab === "Draft" && (
        <div className="p-4 text-center text-gray-500">
          <p>No draft documents found.</p>
        </div>
      )}
      {currentTab === "Actions Required" && (
        <div className="p-4 text-center text-gray-500">
          <p>No documents requiring action.</p>
        </div>
      )}
      {currentTab === "Waiting for Others" && (
        <div className="p-4 text-center text-gray-500">
          <p>No documents waiting for others.</p>
        </div>
      )}
      {currentTab === "Completed" && (
        <div className="p-4 text-center text-gray-500">
          <p>No completed documents found.</p>
        </div>
      )}
      {currentTab === "Declined" && (
        <div className="p-4 text-center text-gray-500">
          <p>No declined documents found.</p>
        </div>
      )}
      {currentTab === "Cancelled" && (
        <div className="p-4 text-center text-gray-500">
          <p>No cancelled documents found.</p>
        </div>
      )}
    </Layout>
  )
}

