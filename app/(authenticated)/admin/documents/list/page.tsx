"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import DataTable, { type Column } from "../../../../../components/data-table"
import { Button } from "../../../../../components/ui/button"
import { toast } from "../../../../../components/ui/use-toast"
import { Plus } from "lucide-react"
import DataTable , { type Column }from "../../../../../components/admin/data-table"

export default function DocumentsList() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  async function fetchDocuments() {
    // Mock data - replace with actual API call
    return [
      {
        id: "1",
        name: "Personal Injury/ Insurance Payment Demand Letter",
        slug: "personal-injury-letter",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "2",
        name: "Business Proposal",
        slug: "business-proposal",
        description: "",
        subCategories: "No Sub-Categories",
      },
      { id: "3", name: "Invoice", slug: "invoice", description: "", subCategories: "No Sub-Categories" },
      {
        id: "4",
        name: "Letter of Intent for General Property Purchase",
        slug: "letter-of-intent",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "5",
        name: "Vehicle Power of Attorney",
        slug: "vehicle-power-of-attorney",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "6",
        name: "Cease and Desist – Harassment",
        slug: "cease-and-desist-harassment",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "7",
        name: "Cease and Desist – Defamation",
        slug: "cease-and-desist-defamation",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "8",
        name: "Photo Licensing (License) Agreement",
        slug: "photo-licensing-agreement",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "9",
        name: "Photo Release Form",
        slug: "photo-release-form",
        description: "",
        subCategories: "No Sub-Categories",
      },
      {
        id: "10",
        name: "Affidavit of Paternity",
        slug: "affidavit-of-paternity",
        description: "",
        subCategories: "No Sub-Categories",
      },
    ]
  }
  

  async function deleteDocument(id: string) {
    console.log("Deleting document:", id)
    // Replace with actual API call
    return { success: true }
  }
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments()
        setDocuments(data)
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

    loadDocuments()
  }, [])

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteDocument(item.id)
        setDocuments(documents.filter((doc: any) => doc.id !== item.id))
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
    { key: "slug", label: "SLUG" },
    { key: "description", label: "DESCRIPTION" },
    {
      key: "subCategories",
      label: "SUB-CATEGORIES",
      render: (value) => <span className="italic text-muted-foreground">{value}</span>,
    },
  ]

  const actions = [
    {
      label: "Show",
      color: "cyan",
      onClick: (item: any) => router.push(`/admin/documents/show/${item.id}`),
    },
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) => router.push(`/admin/documents/edit/${item.id}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ]

  if (isLoading) {
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

        <DataTable title="Documents" columns={columns} data={documents} actions={actions} />
      </div>
    </div>
  )
}
