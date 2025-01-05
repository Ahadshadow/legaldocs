"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical } from 'lucide-react'

const documents = {
  all: [
    {
      name: "Lease/Rental Agreement",
      status: "Start E-Sign",
      lastUpdated: "Today",
      owner: "You",
    },
    {
      name: "Employee Non-Disclosure Agreement",
      status: "Draft",
      lastUpdated: "Today",
      owner: "You",
    },
    {
      name: "Employee Non-Disclosure Agreement",
      status: "Start E-Sign",
      lastUpdated: "Today",
      owner: "You",
    },
    {
      name: "Lease/Rental Agreement",
      status: "Start E-Sign",
      lastUpdated: "Today",
      owner: "You",
    },
  ],
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
        <DropdownMenuItem onClick={() => console.log("View clicked")}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Edit clicked")}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Delete clicked")}>Delete</DropdownMenuItem>
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

