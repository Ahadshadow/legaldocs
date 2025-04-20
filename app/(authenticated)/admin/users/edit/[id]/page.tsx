"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"
// import { Label } from "../../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { toast } from "../../../../../../components/ui/use-toast"
import { Input } from "../../../../../../components/ui/input"
import { Label } from "../../../../../../components/ui/label"


export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    type: "",
    slug: "",
  })


 async function updateUser(id: string, data: any) {
  console.log("Updating user:", id, data)
  // Replace with actual API call
  return { id, ...data }
}

  async function fetchUsers() {
    // Mock data - replace with actual API call
    return [
      { id: "1", name: "Test User", slug: "test-user", email: "test@example.com", phone: "N/A", type: "Admin" },
      {
        id: "2",
        name: "Abdulahad Tahir",
        slug: "abdulahad-tahir",
        email: "abdulahadtahir433@gmail.com",
        phone: "+923044688919",
        type: "User",
      },
      { id: "3", name: "ahad 2", slug: "ahad-2", email: "sahdowahad@gmail.com", phone: "03044688919", type: "User" },
      {
        id: "4",
        name: "Masub Ghazali",
        slug: "masub-ghazali",
        email: "masubghazali26@gmail.com",
        phone: "+923245658644",
        type: "User",
      },
      { id: "5", name: "Andrej kutnar", slug: "andrej-kutnar", email: "andro822@gmail.com", phone: "+386", type: "User" },
    ]
  }
  

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await fetchUsers()
        const user = users.find((u: any) => u.id === id)

        if (user) {
          // Split name into first and last name if needed
          const nameParts = user.name.split(" ")
          const firstName = nameParts[0] || ""
          const lastName = nameParts.slice(1).join(" ") || ""

          setFormData({
            firstName,
            lastName,
            displayName: user.name,
            email: user.email,
            phone: user.phone,
            type: user.type,
            slug: user.slug,
          })
        } else {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          })
          router.push("/admin/users/list")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user",
          variant: "destructive",
        })
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
      // Combine first and last name for the full name
      const userData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      }

      await updateUser(id, userData)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      router.push("/admin/users/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Edit User</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              className="mt-1"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              className="mt-1"
              value={formData.lastName}
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
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="john-doe"
              className="mt-1"
              value={formData.slug}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">URL-friendly version of the display name</p>
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
                <SelectItem value="Moderator">Moderator</SelectItem>
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
