"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Menu, Plus, X, ChevronDown, ChevronRight, FileText, MoreVertical, Clock, Share2, FileSignature, Users, Trash2, CheckCircle, Clock4, XCircle, FileDown, Ban } from 'lucide-react'
import { cn } from "../lib/utils"
import { useSidebar } from "./context/SidebarContext"

const baseUrl = "/app/dashboard/documents"

const routes = [
  { name: "My Documents", href: `${baseUrl}`, icon: FileText },
  { name: "Recent", href: `${baseUrl}/recent`, icon: Clock },
  { name: "Shared With Me", href: `${baseUrl}/shared`, icon: Share2 },
  {
    name: "E-Sign Status",
    href: `${baseUrl}/sign`,
    icon: FileSignature,
    children: [
      { name: "Actions Required", href: `${baseUrl}/sign/actions-required`, icon: Clock4 },
      { name: "Waiting for Others", href: `${baseUrl}/sign/waiting`, icon: Clock },
      { name: "Completed", href: `${baseUrl}/sign/completed`, icon: CheckCircle },
      { name: "Draft", href: `${baseUrl}/sign/draft`, icon: FileDown },
      { name: "Cancelled", href: `${baseUrl}/sign/cancelled`, icon: XCircle },
      { name: "Declined", href: `${baseUrl}/sign/declined`, icon: Ban },
    ],
  },
  { name: "Users & Access", href: `${baseUrl}/users`, icon: Users },
  { name: "Trash", href: `${baseUrl}/trash`, icon: Trash2 },
];

const documents = {
  all: [
    { name: "Lease/Rental Agreement", status: "Start E-Sign", lastUpdated: "Today", owner: "You" },
    { name: "Employee Non-Disclosure Agreement", status: "Draft", lastUpdated: "Today", owner: "You" },
    { name: "Employee Non-Disclosure Agreement", status: "Start E-Sign", lastUpdated: "Today", owner: "You" },
    { name: "Lease/Rental Agreement", status: "Start E-Sign", lastUpdated: "Today", owner: "You" },
  ],
}

export default function NavHeader() {
  const { openSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center" style={{ maxWidth: "100%", paddingLeft: '35px', paddingRight: '25px' }}>
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={openSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold">
            legaltemplates.
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* <Button variant="outline" className="hidden lg:inline-flex">
            Upgrade Plan
          </Button> */}

          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(["/sign"]);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/documents");
    }
    return pathname.startsWith(href);
  };

  const toggleExpand = (href) => {
    setExpanded((current) =>
      current.includes(href)
        ? current.filter((h) => h !== href)
        : [...current, href]
    );
  };

  const renderNavItem = (route, level = 0) => {
    const isExpandable = route.children && route.children.length > 0;
    const isExpanded = expanded.includes(route.href);
    const active = isActive(route.href);

    return (
      <div key={route.href} className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex justify-start items-center",
            active
              ? "bg-[#5586ff]/10 text-black hover:bg-[#5586ff]/20"
              : "text-gray-500 hover:bg-[#5586ff]/5 hover:text-gray-900",
            level > 0 && "pl-8"
          )}
          onClick={() => (isExpandable ? toggleExpand(route.href) : undefined)}
          asChild={!isExpandable}
        >
          {isExpandable ? (
            <div className="flex items-center justify-between w-full">
              <route.icon
                className={cn(
                  "mr-2 h-4 w-4",
                  active ? "text-[#5586ff]" : "text-gray-500"
                )}
              />
              <span style={{ marginLeft: "0.55rem" }}>{route.name}</span>
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          ) : (
            <Link
              href={route.href}
              className="flex items-center justify-start w-full"
              style={{ justifyContent: "flex-start" }}
            >
              <route.icon
                className={cn(
                  "mr-2 h-4 w-4",
                  active ? "text-[#5586ff]" : "text-gray-500"
                )}
              />
              <span>{route.name}</span>
            </Link>
          )}
        </Button>

        {isExpandable && isExpanded && (
          <div className="space-y-1">
            {route.children.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="px-4 py-2">
        <Button className="w-full justify-start" style={{ background: "#5586ff" }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {routes.map((route) => renderNavItem(route))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Sheet Sidebar (Mobile View) */}
      <Sheet open={isOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 h-screen md:hidden">
          <nav className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 h-16 border-b">
              <span className="text-lg font-semibold">legaltemplates.</span>
              <Button size="icon" variant="ghost" onClick={closeSidebar}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <SidebarContent />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <SidebarContent />
      </aside>
    </>
  );
}

export function DocumentsTable({ category }) {
  const docs = documents[category] || documents.all

  return (
    <div className="p-6">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-Sign Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((document, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-gray-500" />
                    {document.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant={document.status === "Draft" ? "outline" : "default"}
                    size="sm"
                  >
                    {document.status}
                  </Button>
                </TableCell>
                <TableCell>{document.lastUpdated}</TableCell>
                <TableCell>{document.owner}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

