"use client";

import type React from "react";
import { useState } from "react";
import { User, ChevronDown, Grid, FileText, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import UserDropdown from "./UserDropdown";

export default function Dashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [userExpanded, setUserExpanded] = useState(true);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [subCategoriesExpanded, setSubCategoriesExpanded] = useState(false);
  const [documentsExpanded, setDocumentsExpanded] = useState(false);

  const [supportExpanded, setSupportExpanded] = useState({
    category: false,
    subCategory: false,
    blog: false,
  });

  const pathname = usePathname();

  const toggleSupportItems = (key: string) =>
    setSupportExpanded((oldState) => {
      return { ...oldState, [key]: !oldState[key] };
    });
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-[240px] border-r flex flex-col h-screen">
        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Legal Templates</h1>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-2">
          <div className="p-3">
            <Link href="/admin">
              <div
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                  pathname === "/admin" && "bg-black text-white"
                )}
              >
                <Grid
                  size={18}
                  className={
                    pathname === "/admin"
                      ? "text-white"
                      : "text-muted-foreground"
                  }
                />
                <span className="text-sm">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Components Section */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 px-2">
              COMPONENTS
            </div>

            {/* User Section */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => setUserExpanded(!userExpanded)}
              >
                <div className="flex items-center gap-2">
                  <User size={18} className="text-muted-foreground" />
                  <span className="text-sm">Users</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    userExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {userExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/users/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/users/add" && "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/users/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/users/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/users/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/users/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
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
                  <LayoutGrid size={18} className="text-muted-foreground" />
                  <span className="text-sm">Categories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    categoriesExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {categoriesExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/categories/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/categories/add" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/categories/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/categories/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/categories/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/categories/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
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
                  <LayoutGrid size={18} className="text-muted-foreground" />
                  <span className="text-sm">SubCategories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    subCategoriesExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {subCategoriesExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/subcategories/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/subcategories/add" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/subcategories/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/subcategories/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/subcategories/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/subcategories/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
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
            <div className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 px-2">
              MANAGE DOCUMENTS
            </div>

            {/* Documents */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => setDocumentsExpanded(!documentsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-muted-foreground" />
                  <span className="text-sm">Documents</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    documentsExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {documentsExpanded && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/documents/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/documents/add" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/documents/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/documents/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/documents/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/documents/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SUPPORT Section */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 px-2">
              SUPPORT
            </div>

            {/*SUPPORT Categories */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer mt-1"
                onClick={() => toggleSupportItems("category")}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid size={18} className="text-muted-foreground" />
                  <span className="text-sm">Categories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    supportExpanded.category ? "rotate-180" : ""
                  }`}
                />
              </div>

              {supportExpanded.category && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/support/categories/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/support/categories/add" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/support/categories/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/support/categories/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/support/categories/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/support/categories/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/*SUPPORT SubCategories */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer mt-1"
                onClick={() => toggleSupportItems("subCategory")}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid size={18} className="text-muted-foreground" />
                  <span className="text-sm">Sub Categories</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    supportExpanded.subCategory ? "rotate-180" : ""
                  }`}
                />
              </div>

              {supportExpanded.subCategory && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/support/subcategories/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/support/subcategories/add" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/support/subcategories/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/support/subcategories/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/support/subcategories/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/support/subcategories/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">List</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/*SUPPORT Blog */}
            <div>
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer mt-1"
                onClick={() => toggleSupportItems("blog")}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-muted-foreground" />
                  <span className="text-sm">Blogs</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    supportExpanded.blog ? "rotate-180" : ""
                  }`}
                />
              </div>

              {supportExpanded.blog && (
                <div className="ml-7 space-y-1 mt-1">
                  <Link href="/admin/support/blogs/add">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/support/blogs/add" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/support/blogs/add"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">Add</span>
                    </div>
                  </Link>
                  <Link href="/admin/support/blogs/list">
                    <div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                        pathname === "/admin/support/blogs/list" &&
                          "bg-black text-white"
                      )}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathname === "/admin/support/blogs/list"
                            ? "bg-white"
                            : "bg-muted-foreground"
                        }`}
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
        {/* Header */}
        <header className="border-b p-4 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Admin Panel</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">Admin User</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
