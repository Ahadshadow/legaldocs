"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../../components/ui/button"
import { toast } from "../../../../../components/ui/use-toast"
import { Plus } from "lucide-react"
import DataTable, { type Column } from "../../../../../components/admin/data-table"
import { SC } from "../../../../../service/Api/serverCall"
import { CustomPagination } from "../../../../../components/ui/custom-pagination"

export default function DocumentsList() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  })

  useEffect(() => {
    loadDocuments(pagination.currentPage)
  }, [])

  const loadDocuments = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await SC.getCall({ url: `getAllAdminDocument?page=${page}` })

      // Extract pagination data from response
      const { current_page, last_page, per_page, total, data: documentsData } = response.data.data

      // Update pagination state
      setPagination({
        currentPage: current_page,
        totalPages: last_page,
        perPage: per_page,
        total: total,
      })

      // Format the data for display
      const formattedData = documentsData.map((doc: any) => ({
        ...doc,
        subCategories: doc?.sub_categories?.map?.((sub: any) => sub.name).join(", ") || "",
      }))

      setDocuments(formattedData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadDocuments(page)
  }

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await SC.deleteCall({ url: `document/${item.slug}` })

        // Reload the current page after deletion
        loadDocuments(pagination.currentPage)

        toast({
          title: "Success",
          description: "Document deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive",
        })
      }
    }
  }

  const columns: Column[] = [
    { key: "name", label: "NAME" },
    { key: "description", label: "DESCRIPTION" },
    {
      key: "subCategories",
      label: "SUBCATEGORY",
      render: (value) => <span className="italic text-muted-foreground">{value}</span>,
    },
  ]

  const actions = [
    {
      label: "Edit Template",
      color: "cyan",
      onClick: (item: any) => router.push(`/admin/documents/template-editor/${item.slug}`),

    },
    {
      label: "Edit Details",
      color: "orange",
      onClick: (item: any) => router.push(`/admin/documents/edit/${item.slug}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ]

  if (isLoading && pagination.currentPage === 1) {
    return <div className="p-6 text-center">Loading documents...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Documents List</h1>
          <Button onClick={() => router.push("/admin/documents/add")} className="bg-black hover:bg-black/90">
            <Plus className="mr-2 h-4 w-4" /> Add Document
          </Button>
        </div>

        <DataTable
          title="Documents"
          columns={columns}
          data={documents}
          actions={actions}
          isLoading={isLoading}
          showPagination={false}
        />

        {/* Pagination */}
        <div className="mt-6">
          <CustomPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxPageButtons={5}
          />
        </div>

        {/* Pagination summary */}
        <div className="mt-2 text-sm text-gray-500 text-center">
          Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
          {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} entries
        </div>
      </div>
    </div>
  )
}
