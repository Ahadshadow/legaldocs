"use client"
import { Button } from "./button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
  maxPageButtons?: number
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = false,
  maxPageButtons = 5,
}: CustomPaginationProps) {
  // Calculate which page buttons to show
  const getPageButtons = () => {
    const pageButtons = []

    // If we have fewer pages than the max, show all pages
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i)
      }
      return pageButtons
    }

    // Always show first page
    pageButtons.push(1)

    // Calculate start and end of page range
    let startPage = Math.max(2, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 3)

    // Adjust if we're near the end
    if (endPage - startPage < maxPageButtons - 3) {
      startPage = Math.max(2, endPage - (maxPageButtons - 3))
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      pageButtons.push("ellipsis-start")
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(i)
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageButtons.push("ellipsis-end")
    }

    // Always show last page
    if (totalPages > 1) {
      pageButtons.push(totalPages)
    }

    return pageButtons
  }

  const pageButtons = getPageButtons()

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* First page button */}
      {showFirstLast && currentPage > 3 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0"
          >
            1
          </Button>
          {currentPage > 4 && (
            <span className="flex items-center justify-center h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )}
        </>
      )}

      {/* Page buttons */}
      {pageButtons.map((page, i) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <span key={`ellipsis-${i}`} className="flex items-center justify-center h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className={cn("h-8 w-8 p-0", currentPage === page ? "bg-black text-white hover:bg-black/90" : "")}
          >
            {page}
          </Button>
        )
      })}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="flex items-center justify-center h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}

