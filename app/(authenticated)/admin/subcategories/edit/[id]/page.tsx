"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"
import { Label } from "../../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { toast } from "../../../../../../components/ui/use-toast"

export default function EditSubcategory({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
  })
  async function fetchCategories() {
    // Mock data - replace with actual API call
    return [
      { id: "1", name: "BUSINESS", slug: "business" },
      { id: "2", name: "REAL ESTATE", slug: "real-estate" },
      { id: "3", name: "PERSONAL", slug: "personal" },
    ]
  }

  async function updateSubcategory(id: string, data: any) {
    console.log("Updating subcategory:", id, data)
    // Replace with actual API call
    return { id, ...data }
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
    const loadData = async () => {
      try {
        const [categoriesData, subcategoriesData] = await Promise.all([fetchCategories(), fetchSubcategories()])

        setCategories(categoriesData)

        const subcategory = subcategoriesData.find((subcat: any) => subcat.id === id)
        if (subcategory) {
          setFormData({
            name: subcategory.name,
            slug: subcategory.slug || "",
            category: subcategory.category,
          })
        } else {
          toast({
            title: "Error",
            description: "Subcategory not found",
            variant: "destructive",
          })
          router.push("/admin/subcategories/list")
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateSubcategory(id, formData)
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      })
      router.push("/admin/subcategories/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subcategory",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Subcategory</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Subcategory Name"
              className="mt-1"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="subcategory-slug"
              className="mt-1"
              value={formData.slug}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">URL-friendly version of the name</p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.push("/admin/subcategories/list")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
