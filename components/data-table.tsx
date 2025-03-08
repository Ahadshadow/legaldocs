"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { CustomPagination } from "../components/ui/custom-pagination"

export type Column = {
  key: string
  label: string
  render?: (value: any, item: any) => React.ReactNode
}

export type Action = {
  label: string
  color: string
  onClick: (item: any) => void
}

type DataTableProps = {
  title: string
  columns: Column[]
  data: any[]
  actions?: Action[]
  itemsPerPage?: number
  showPagination?: boolean
}

export default function DataTable({
  title,
  columns,
  data,
  actions = [],
  itemsPerPage = 10,
  showPagination = true,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-6">{title}</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {actions.length > 0 && <TableHead className="text-right">ACTIONS</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
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
                          variant={action.color as any}
                          size="sm"
                          onClick={() => action.onClick(item)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="mt-4">
          <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

