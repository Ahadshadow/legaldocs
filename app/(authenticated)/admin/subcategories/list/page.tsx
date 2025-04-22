"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../../components/ui/button"
import { toast } from "../../../../../components/ui/use-toast"
import { Plus } from "lucide-react"
import DataTable from "../../../../../components/admin/data-table"
import { SC } from "../../../../../service/Api/serverCall"
import { CustomPagination } from "../../../../../components/ui/custom-pagination"

export default function SubcategoriesList() {
  const router = useRouter()
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  })

  useEffect(() => {
    loadSubcategories(pagination.currentPage)
  }, [])

  const loadSubcategories = async (page = 1) => {
    try {
      setIsLoading(true)
      const data = await SC.getCall({ url: `subcategories?page=${page}` })

      // Extract pagination data from response
      const { current_page, last_page, per_page, total, data: subcategoriesData } = data.data.data

      // Update pagination state
      setPagination({
        currentPage: current_page,
        totalPages: last_page,
        perPage: per_page,
        total: total,
      })

      // Map the data to include category name
      const rawData = subcategoriesData.map((item: any) => ({
        ...item,
        category: item.category.name,
      }))

      setSubcategories(rawData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subcategories",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadSubcategories(page)
  }

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await SC.deleteCall({
          url: `subcategories/${item.slug}`,
        })

        // Reload the current page after deletion
        loadSubcategories(pagination.currentPage)

        toast({
          title: "Success",
          description: "Subcategory deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete subcategory",
          variant: "destructive",
        })
      }
    }
  }

  const columns = [
    { key: "name", label: "NAME" },
    { key: "category", label: "CATEGORY" },
    { key: "slug", label: "SLUG" },
  ]

  const actions = [
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) => router.push(`/admin/subcategories/edit/${item.slug}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ]

  if (isLoading && pagination.currentPage === 1) {
    return <div className="p-6 text-center">Loading subcategories...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Subcategories List</h1>
          <Button onClick={() => router.push("/admin/subcategories/add")} className="bg-black hover:bg-black/90">
            <Plus className="mr-2 h-4 w-4" /> Add Subcategory
          </Button>
        </div>

        <DataTable
          title="Subcategories"
          columns={columns}
          data={subcategories}
          actions={actions}
          // isLoading={isLoading}
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
