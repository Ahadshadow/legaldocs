"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"
import { Label } from "../../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { Textarea } from "../../../../../../components/ui/textarea"
import { toast } from "../../../../../../components/ui/use-toast"

export default function EditDocument({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(false)
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subCategories: "",
    slug: "",
    image: null as File | null,
  })
  const [currentImage, setCurrentImage] = useState<string | null>(null)
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

  async function updateDocument(id: string, data: any) {
    console.log("Updating document:", id, data)
    // Replace with actual API call
    return { id, ...data }
  }

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
    const loadData = async () => {
      try {
        const [subcategoriesData, documentsData] = await Promise.all([fetchSubcategories(), fetchDocuments()])

        setSubcategories(subcategoriesData)

        const document = documentsData.find((doc: any) => doc.id === id)
        if (document) {
          setFormData({
            name: document.name,
            description: document.description || "",
            subCategories: document.subCategories || "No Sub-Categories",
            slug: document.slug || "",
            image: null,
          })
          // If there's an image URL in the document data
          if (document.imageUrl) {
            setCurrentImage(document.imageUrl)
          }
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
          description: "Failed to load data",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleSubcategoryChange = (value: string) => {
    setFormData({
      ...formData,
      subCategories: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you'd handle file upload here
      await updateDocument(id, formData)
      toast({
        title: "Success",
        description: "Document updated successfully",
      })
      router.push("/admin/documents/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Document</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="subcategories">Subcategories</Label>
            <Select value={formData.subCategories} onValueChange={handleSubcategoryChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Sub-Categories">No Sub-Categories</SelectItem>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat.id} value={subcat.name}>
                    {subcat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">
              Document Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" className="mt-1" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="document-slug"
              className="mt-1"
              value={formData.slug}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">URL-friendly version of the name</p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="mt-1 min-h-[100px]"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="image">Upload Image</Label>
            {currentImage && (
              <div className="mt-2 mb-2">
                <p className="text-sm mb-1">Current image:</p>
                <div className="w-32 h-32 border rounded overflow-hidden">
                  <img
                    src={currentImage || "/placeholder.svg"}
                    alt="Current document image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="mt-1 flex items-center gap-4">
              <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => document.getElementById("image")?.click()}
              >
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {formData.image ? formData.image.name : "No new file chosen"}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.push("/admin/documents/list")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
