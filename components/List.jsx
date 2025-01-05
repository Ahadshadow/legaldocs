"use client"

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DollarSign, MoreVertical } from 'lucide-react'

export function List({
  items,
  title,
  columns,
  actions,
  className = ""
}) {
  return (
    <div className={`w-full max-w-full overflow-hidden ${className}`}>
      <div className="px-2 sm:px-4 md:px-6 py-4">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-center rounded-md border border-blue-300 bg-blue-50 p-3 text-sm">
            <div className="flex items-center mb-2 sm:mb-0">
              <DollarSign className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-600">Try premium features for free.</span>
            </div>
            <a href="#" className="text-blue-600 font-medium hover:text-blue-500 ml-0 sm:ml-2">
              Upgrade now
            </a>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h1>
      </div>

      <div className="w-full px-[20px] overflow-x-auto max-w-full">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-t border-gray-200">
            <div className="overflow-x-auto max-w-full">
              <Table className="min-w-full max-w-full">
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.name}
                      </TableHead>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableHead className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, i) => (
                    <TableRow key={i}>
                      {columns.map((column, index) => (
                        <TableCell key={index} className="px-3 py-4 whitespace-nowrap text-sm">
                          <div className="truncate max-w-[150px] sm:max-w-none">
                            {column.render(item)}
                          </div>
                        </TableCell>
                      ))}
                      {actions && actions.length > 0 && (
                        <TableCell className="px-3 py-4 whitespace-nowrap text-sm text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actions.map((action, index) => (
                                <DropdownMenuItem key={index} onClick={() => action.onClick(item)}>
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
