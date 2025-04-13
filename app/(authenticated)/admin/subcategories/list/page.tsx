"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import DataTable from "../../../components/data-table"
import { Button } from "../../../../../components/ui/button"
import { toast } from "../../../../../components/ui/use-toast"
import { Plus } from "lucide-react"
import DataTable from "../../../../../components/admin/data-table"

export default function SubcategoriesList() {
  const router = useRouter()
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  async function fetchSubcategories() {
    // Mock data - replace with actual API call
    return [
      { id: "1", name: "Corporate Filings", slug: "corporate-filings", category: "BUSINESS" },
      { id: "2", name: "Employees / Contractors", slug: "employees-contractors", category: "BUSINESS" },
      { id: "3", name: "Customers", slug: "customers", category: "BUSINESS" },
      { id: "4", name: "Suppliers & Partners", slug: "suppliers-partners", category: "BUSINESS" },
      { id: "5", name: "Internet", slug: "internet", category: "BUSINESS" },
      { id: "6", name: "Mergers & Acquisitions", slug: "mergers-acquisitions", category: "BUSINESS" },
      { id: "7", name: "Property Management", slug: "property-management", category: "BUSINESS" },
      { id: "8", name: "Litigation", slug: "litigation", category: "BUSINESS" },
      { id: "9", name: "Tax Forms", slug: "tax-forms", category: "BUSINESS" },
      { id: "10", name: "Operations", slug: "operations", category: "BUSINESS" },
    ]
  }


 async function deleteSubcategory(id: string) {
  console.log("Deleting subcategory:", id)
  // Replace with actual API call
  return { success: true }
}
  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const data = await fetchSubcategories()
        setSubcategories(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subcategories",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSubcategories()
  }, [])

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteSubcategory(item.id)
        setSubcategories(subcategories.filter((subcat: any) => subcat.id !== item.id))
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
      onClick: (item: any) => router.push(`/admin/subcategories/edit/${item.id}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ]

  if (isLoading) {
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

        <DataTable title="Subcategories" columns={columns} data={subcategories} actions={actions} />
      </div>
    </div>
  )
}
