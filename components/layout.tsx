"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  HelpCircle,
  Mail,
  Settings,
  Building2,
  Receipt,
  Palette,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { clearUserData, getUserData } from "../lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userData = getUserData();

  const router = useRouter();

  const handleLogout = () => {
    clearUserData();
    window.dispatchEvent(new Event("storage")); // Notify other components
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <Link href="/" className="font-semibold text-xl">
            legaltemplates.
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden md:block">
              <Button
                variant="ghost"
                className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-normal rounded-md"
              >
                Upgrade Plan
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Link href="/contact" className="flex w-full items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>
                    {userData?.email ? userData.email[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center gap-2 p-4">
                  <Avatar>
                    <AvatarFallback>
                      {userData?.email ? userData.email[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm max-w-[160px] break-words">
                      {userData?.email || "User"}
                    </p>

                    <Link
                      href="/app/user-panel/pricing"
                      className="text-sm text-blue-600"
                    >
                      Upgrade Plan
                    </Link>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <Link
                    href="/app/user-panel/settings/user"
                    className="flex w-full items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>User Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/app/user-panel/settings/company"
                    className="flex w-full items-center"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Company Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/app/user-panel/billing"
                    className="flex w-full items-center"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    <span>Billing History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/app/user-panel/branding"
                    className="flex w-full items-center"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Branding</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link
                    href="/app/user-panel/mydocs"
                    className="flex w-full items-center"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
          <Link
            href="app/user-panel/settings/user"
            className="flex w-full items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>User Settings</span>
          </Link>
        </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link
                    href="/app/user-panel/billing"
                    className="flex w-full items-center"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    <span>Billing History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:transform-none md:border-r md:min-h-[calc(100vh-4rem)] md:p-4 md:space-y-4
          `}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 md:hidden border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/user-panel/pricing">Upgrade</Link>
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 p-4 md:p-0">
            <Link
              href="/app/user-panel/mydocs"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                pathname === "/app/user-panel/mydocs"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="h-5 w-5"
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
              All Documents
            </Link>
            <Link
              href="/app/user-panel/teams"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                pathname === "/app/user-panel/teams"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Teams & Access
            </Link>
            {/* <Link
              href="/app/user-panel/trash"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                pathname === "/app/user-panel/trash" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Trash
            </Link> */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
