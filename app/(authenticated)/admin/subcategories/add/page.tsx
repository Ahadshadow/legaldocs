"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { toast } from "../../../../../components/ui/use-toast"

export default function AddSubcategory() {
  const router = useRouter()
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

  async function createSubcategory(data: any) {
    console.log("Creating subcategory:", data)
    // Replace with actual API call
    return { id: Date.now().toString(), ...data, slug: data.name.toLowerCase().replace(/\s+/g, "-") }
  }
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, category: data[0].name }))
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      }
    }

    loadCategories()
  }, [])

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
      await createSubcategory(formData)
      toast({
        title: "Success",
        description: "Subcategory created successfully",
      })
      router.push("/admin/subcategories/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subcategory",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add Subcategory</h1>

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
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the name (auto-generated if left empty)
            </p>
          </div>

          <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  )
}
