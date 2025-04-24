"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { SC } from "../../../../../service/Api/serverCall"
import { useToast } from "@/adminComponents/ui/use-toast"

export default function AddSubcategory() {
  const { toast } = useToast()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
  })


  async function createSubcategory(data: any) {
    // Replace with actual API call
    return { id: Date.now().toString(), ...data,}
  }
  useEffect(() => {
  
    loadCategories()
  }, [])


  const loadCategories = async () => {
    try {

      const data = await SC.getCall({url: "categories"})
      setCategories(data.data.data.data)
      // if (data.data.data.data.length > 0) {
      //   setFormData((prev) => ({ ...prev, category: data[0].name }))
      // }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

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


      const data = await SC.postCall({url: "subcategories", data: formData})
      router.push("/admin/subcategories/list")
      toast({
        title: "Success",
        description: data.data.message,
      })
      router.push("/admin/subcategories/list")
    } catch (error) {

      
      toast({
        title: "Error",
        description: error.response.data.message,
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


          <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  )
}
