"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Textarea } from "../../../../../components/ui/textarea"
import { toast } from "../../../../../components/ui/use-toast"

export default function CreateDocument() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subCategories: "",
    slug: "",
    image: null as File | null,
  })
  async function createDocument(data: any) {
    console.log("Creating document:", data)
    // Replace with actual API call
    return { id: Date.now().toString(), ...data, slug: data.name.toLowerCase().replace(/\s+/g, "-") }
  }
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
      }
    }

    loadSubcategories()
  }, [])

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
      await createDocument(formData)
      toast({
        title: "Success",
        description: "Document created successfully",
      })
      router.push("/admin/documents/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Create Document</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="subcategories">Subcategories</Label>
            <Select value={formData.subCategories} onValueChange={handleSubcategoryChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sub-Categories</SelectItem>
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
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the name (auto-generated if left empty)
            </p>
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
                {formData.image ? formData.image.name : "No file chosen"}
              </span>
            </div>
          </div>

          <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  )
}
