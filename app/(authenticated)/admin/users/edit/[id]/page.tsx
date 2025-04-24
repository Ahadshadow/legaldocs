"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"
import { Label } from "../../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { SC } from "../../../../../../service/Api/serverCall"
import { useToast } from "@/adminComponents/ui/use-toast"

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const id = unwrappedParams.id

  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    displayName: "",
    email: "",
    phone: "",
    type: "",
    // slug: "",
  })

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await SC.getCall({ url: `users/${id}` })

        if (response.status === 200 && response.data.data) {
          const userData = response.data.data

          // Split name into first and last name if needed
          let first_name = userData.first_name || ""
          let last_name = userData.last_name || ""

          // If first_name/last_name aren't available but displayName is
          if (!first_name && !last_name && userData.displayName) {
            const nameParts = userData.displayName.split(" ")
            first_name = nameParts[0] || ""
            last_name = nameParts.slice(1).join(" ") || ""
          }

          setFormData({
            first_name,
            last_name,
            displayName: userData.displayName || `${first_name} ${last_name}`.trim(),
            email: userData.email || "",
            phone: userData.phone || "",
            type: userData.type || "User",
            // slug: userData.slug || "",
          })
        } else {
          throw new Error("User not found or invalid response")
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load user",
          variant: "destructive",
        })
        router.push("/admin/users/list")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare data for API
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
      }

      // Send data to API
      const response = await SC.putCall({
        url: `users/${id}`,
        data: userData,
      })

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User updated successfully",
        })
        router.push("/admin/users/list")
      } else {
        throw new Error(response.data.message || "Failed to update user")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit User</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              placeholder="John"
              className="mt-1"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              placeholder="Doe"
              className="mt-1"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="JohnDoe"
              className="mt-1"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              className="mt-1"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone No</Label>
            <Input
              id="phone"
              placeholder="658 799 8941"
              className="mt-1"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.push("/admin/users/list")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
