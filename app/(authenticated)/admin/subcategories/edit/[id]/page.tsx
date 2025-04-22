"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"
import { Label } from "../../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { toast } from "../../../../../../components/ui/use-toast"
import { SC } from "../../../../../../service/Api/serverCall"

export default function EditSubcategory({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories first
        const categoriesResponse = await SC.getCall({ url: "categories" })
        const categoriesData = categoriesResponse.data.data.data || []
        setCategories(categoriesData)

        // Then fetch the subcategory details
        const subcategoryResponse = await SC.getCall({ url: `subcategories/${id}` })
        const subcategoryData = subcategoryResponse.data.data

        setFormData({
          name: subcategoryData.name,
          category_id: subcategoryData.category_id,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
        router.push("/admin/subcategories/list")
      } finally {
        setIsLoading(false)
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
      category_id: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await SC.putCall({
        url: `subcategories/${id}`,
        data: formData,
      })

      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      })
      router.push("/admin/subcategories/list")
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update subcategory",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center">Loading subcategory data...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Subcategory</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="category_id">Category</Label>
            <Select value={formData.category_id} onValueChange={handleCategoryChange} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
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
