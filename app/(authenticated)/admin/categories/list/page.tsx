"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import DataTable from "../../../components/data-table"
import { Button } from "../../../../../components/ui/button"
import { toast } from "../../../../../components/ui/use-toast"
import { Plus } from "lucide-react"
import DataTable from "../../../../../components/admin/data-table"

export default function CategoriesList() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  async function fetchCategories() {
    // Mock data - replace with actual API call
    return [
      { id: "1", name: "BUSINESS", slug: "business" },
      { id: "2", name: "REAL ESTATE", slug: "real-estate" },
      { id: "3", name: "PERSONAL", slug: "personal" },
    ]
  }

  async function deleteCategory(id: string) {
    console.log("Deleting category:", id)
    // Replace with actual API call
    return { success: true }
  }
  
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteCategory(item.id)
        setCategories(categories.filter((cat: any) => cat.id !== item.id))
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        })
      }
    }
  }

  const columns = [
    { key: "name", label: "NAME" },
    { key: "slug", label: "SLUG" },
  ]

  const actions = [
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) => router.push(`/admin/categories/edit/${item.id}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ]

  if (isLoading) {
    return <div className="p-6 text-center">Loading categories...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Categories List</h1>
          <Button onClick={() => router.push("/admin/categories/add")} className="bg-black hover:bg-black/90">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        <DataTable title="Categories" columns={columns} data={categories} actions={actions} showPagination={false} />
      </div>
    </div>
  )
}
