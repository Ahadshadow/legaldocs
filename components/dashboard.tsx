"use client"

import type React from "react"

import { useState } from "react"
import { User, ChevronDown, Grid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Dashboard({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userExpanded, setUserExpanded] = useState(true)
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const [subCategoriesExpanded, setSubCategoriesExpanded] = useState(false)
  const [documentsExpanded, setDocumentsExpanded] = useState(false)

  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-[202px] border-r flex flex-col">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <Link href="/admin">
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                <Grid size={18} className="text-muted-foreground" />
                <span className="text-sm">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Components Section */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">COMPONENTS</div>

            {/* User Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => setUserExpanded(!userExpanded)}
              >
                <div className="flex items-center gap-2">
                  <User size={18} className="text-muted-foreground" />
                  <span className="text-sm">User</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${userExpanded ? "rotate-180" : ""}`}
                />
              </div>

              {userExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/users/add">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/users/add" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/users/add" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/users/list">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/users/list" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/users/list" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer mt-1"
                onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                  </svg>
                  <span className="text-sm">Categories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${categoriesExpanded ? "rotate-180" : ""}`}
                />
              </div>

              {categoriesExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/categories/add">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/categories/add" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/categories/add" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/categories/list">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/categories/list" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/categories/list" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* SubCategories */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer mt-1"
                onClick={() => setSubCategoriesExpanded(!subCategoriesExpanded)}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#6E6B7B" strokeWidth="2" />
                  </svg>
                  <span className="text-sm">SubCategories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${subCategoriesExpanded ? "rotate-180" : ""}`}
                />
              </div>

              {subCategoriesExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/subcategories/add">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/subcategories/add" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/subcategories/add" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/subcategories/list">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/subcategories/list" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/subcategories/list" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Manage Documents Section */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">MANAGE DOCUMENTS</div>

            {/* Documents */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => setDocumentsExpanded(!documentsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19"
                      stroke="#6E6B7B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
                      stroke="#6E6B7B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">Documents</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${documentsExpanded ? "rotate-180" : ""}`}
                />
              </div>

              {documentsExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/documents/add">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/documents/create" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/documents/create" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/documents/list">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/documents/list" ? "bg-black text-white" : "hover:bg-muted"} cursor-pointer`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${pathname === "/documents/list" ? "bg-white" : "bg-muted-foreground"}`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

