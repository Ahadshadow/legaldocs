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
import { SC } from "../../../../../../service/Api/serverCall"

export default function EditDocument({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subcategory_id: "",
    image: null as File | null,
  })
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch subcategories
        const subcategoriesResponse = await SC.getCall({ url: "subcategories" })
        // setSubcategories(subcategoriesResponse.data.data.data || [])

        console.log("subcategoriesResponse", subcategoriesResponse);
        
        // Fetch document details
        const documentResponse = await SC.getCall({ url: `document/${id}` })
        const documentData = documentResponse.data.data

        console.log("documentData", documentData);
        
        // setFormData({
        //   name: documentData.name,
        //   description: documentData.description || "",
        //   subcategory_id: documentData.subcategory_id || "",
        //   image: null,
        // })

        // If there's an image URL in the document data
        if (documentData.image_url) {
          // setCurrentImage(documentData.image_url)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
        router.push("/admin/documents/list")
      } finally {
        setIsLoading(false)
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
      subcategory_id: value === "none" ? "" : value,
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
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)

      if (formData.subcategory_id) {
        formDataToSend.append("subcategory_id", formData.subcategory_id)
      }

      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      // Use PUT or PATCH depending on your API
      await SC.putCall({
        url: `documents/${id}`,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Success",
        description: "Document updated successfully",
      })
      router.push("/admin/documents/list")
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update document",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center">Loading document data...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Document</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="subcategory_id">Subcategory</Label>
            <Select value={formData.subcategory_id || "none"} onValueChange={handleSubcategoryChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Subcategory</SelectItem>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat._id} value={subcat._id}>
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
