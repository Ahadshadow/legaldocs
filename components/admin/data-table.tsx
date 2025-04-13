"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "../ui/button"

export type Column = {
  key: string
  label: string
  render?: (value: any, item: any) => React.ReactNode
}

type Action = {
  label: string
  color: string
  onClick: (item: any) => void
}

type DataTableProps = {
  title: string
  columns: Column[]
  data: any[]
  actions?: Action[]
  showPagination?: boolean
  itemsPerPage?: number
}

export default function DataTable({
  title,
  columns,
  data,
  actions = [],
  showPagination = true,
  itemsPerPage = 10,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = showPagination ? filteredData.slice(startIndex, startIndex + itemsPerPage) : filteredData

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Get color class based on action color
  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "orange":
        return "bg-orange-500 hover:bg-orange-600 text-white"
      case "cyan":
        return "bg-cyan-500 hover:bg-cyan-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl font-medium">{title}</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-medium">
                    {column.label}
                  </TableHead>
                ))}
                {actions.length > 0 && <TableHead className="text-right">ACTIONS</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-6">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              size="sm"
                              className={`px-3 py-1 h-8 ${getColorClass(action.color)}`}
                              onClick={() => action.onClick(item)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
