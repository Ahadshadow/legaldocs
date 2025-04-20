"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../../../components/ui/button"
import { toast } from "../../../../../../components/ui/use-toast"
import { ArrowLeft, Edit } from "lucide-react"

export default function ShowDocument({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [document, setDocument] = useState<any>(null)
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
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const documents = await fetchDocuments()
        const doc = documents.find((d: any) => d.id === id)

        if (doc) {
          setDocument(doc)
        } else {
          toast({
            title: "Error",
            description: "Document not found",
            variant: "destructive",
          })
          router.push("/admin/documents/list")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load document",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [id, router])

  if (isLoading) {
    return <div className="p-6 text-center">Loading document...</div>
  }

  if (!document) {
    return <div className="p-6 text-center">Document not found</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium">Document Details</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/documents/list")}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </Button>
            <Button
              onClick={() => router.push(`/admin/documents/edit/${id}`)}
              className="bg-black hover:bg-black/90 flex items-center gap-1"
            >
              <Edit className="w-4 h-4" /> Edit
            </Button>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid gap-6">
              <div>
                <h2 className="text-lg font-medium mb-2">{document.name}</h2>
                <p className="text-sm text-muted-foreground">Slug: {document.slug}</p>
              </div>

              {document.description && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm">{document.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Subcategories</h3>
                <p className="text-sm">{document.subCategories}</p>
              </div>

              {document.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Image</h3>
                  <div className="mt-2 w-full max-w-xs border rounded overflow-hidden">
                    <img src={document.imageUrl || "/placeholder.svg"} alt={document.name} className="w-full h-auto" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
