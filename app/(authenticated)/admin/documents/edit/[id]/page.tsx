"use client"

import type React from "react"
import type { ChangeEvent, FormEvent } from "react"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"
import { Label } from "../../../../../../components/ui/label"
import { Textarea } from "../../../../../../components/ui/textarea"
import { SC } from "../../../../../../service/Api/serverCall"
import { Check, ChevronDown, X } from "lucide-react"
import { useToast } from "@/adminComponents/ui/use-toast"

export default function EditDocument({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const id = unwrappedParams.id

  const [isLoading, setIsLoading] = useState(true)
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  })
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  // Ref for dropdown
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch subcategories
        const subcategoriesResponse = await SC.getCall({ url: "subCategoriesWithoutPagination" })
        setSubcategories(subcategoriesResponse.data.data || [])

        // Fetch document details
        const documentResponse = await SC.getCall({ url: `document/${id}` })
        const documentData = documentResponse.data.data

        setFormData({
          name: documentData.name || "",
          description: documentData.description || "",
          image: null,
        })

        // Set selected subcategories if they exist
        if (documentData.sub_categories && Array.isArray(documentData.sub_categories)) {
          const subcategoryIds = documentData.sub_categories.map((subcat: any) => subcat._id)
          setSelectedSubcategories(subcategoryIds)
        }

        // If there's an image URL in the document data
        if (documentData.image_url) {
          setCurrentImage(documentData.image_url)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load document data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const toggleSubcategory = (id: string) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const removeSubcategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent dropdown from opening
    setSelectedSubcategories((prev) => prev.filter((item) => item !== id))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)

      // Append each selected subcategory ID
      selectedSubcategories.forEach((subcategoryId) => {
        formDataToSend.append("sub_Categories[]", subcategoryId)
      })

      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      // Update document
      await SC.postCall({
        url: `document/${id}/update`,
        data: formDataToSend,
        formData: true,
      })

      toast({
        title: "Success",
        description: "Document updated successfully",
      })
      router.push("/admin/documents/list")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update document",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get subcategory name by ID
  const getSubcategoryName = (id: string) => {
    const subcategory = subcategories.find((subcat) => subcat._id === id)
    return subcategory ? subcategory.name : ""
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading document data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit Document</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="subcategories">Subcategories</Label>
            <div className="relative mt-1" ref={dropdownRef}>
              <div
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="truncate">
                  {selectedSubcategories.length > 0
                    ? `${selectedSubcategories.length} subcategories selected`
                    : "Select subcategories"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-background shadow-lg">
                  <div className="max-h-60 overflow-auto p-1">
                    {subcategories.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-muted-foreground">No subcategories available</div>
                    ) : (
                      subcategories.map((subcat) => (
                        <div
                          key={subcat._id}
                          className="flex items-center px-2 py-1.5 text-sm hover:bg-muted rounded cursor-pointer"
                          onClick={() => toggleSubcategory(subcat._id)}
                        >
                          <div className="flex h-4 w-4 items-center justify-center rounded-sm border mr-2">
                            {selectedSubcategories.includes(subcat._id) && <Check className="h-3 w-3" />}
                          </div>
                          <span>{subcat.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Selected items */}
              {selectedSubcategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSubcategories.map((id) => (
                    <div key={id} className="flex items-center gap-1 bg-muted text-xs px-2 py-1 rounded-full">
                      {getSubcategoryName(id)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={(e) => removeSubcategory(id, e)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
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
