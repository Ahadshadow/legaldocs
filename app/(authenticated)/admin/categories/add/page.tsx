"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { toast } from "../../../../../components/ui/use-toast"

export default function AddCategory() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  async function createCategory(data: any) {
    console.log("Creating category:", data)
    // Replace with actual API call
    return { id: Date.now().toString(), ...data, slug: data.name.toLowerCase().replace(/\s+/g, "-") }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createCategory(formData)
      toast({
        title: "Success",
        description: "Category created successfully",
      })
      router.push("/admin/categories/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add Category</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Category Name"
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
              placeholder="category-slug"
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
