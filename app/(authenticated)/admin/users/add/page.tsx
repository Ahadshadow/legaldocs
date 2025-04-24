"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { SC } from "../../../../../service/Api/serverCall"
import { useToast } from "@/adminComponents/ui/use-toast"

export default function AddUser() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    displayName: "",
    email: "",
    phone: "",
    type: "User",
    password: "",
    // slug: "",
  })
  const { toast } = useToast()


  // Generate slug from display name
  // useEffect(() => {
  //   if (formData.displayName && !formData.slug) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       slug: prev.displayName.toLowerCase().replace(/\s+/g, "-"),
  //     }))
  //   }
  // }, [formData.displayName])

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
        password: formData.password,
        // slug: formData.slug || formData.displayName.toLowerCase().replace(/\s+/g, "-"),
      }

      // Send data to API
      const response = await SC.postCall({
        url: "users",
        data: userData,
      })

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Success",
          description: "User created successfully",
        })
        router.push("/admin/users/list")
      } else {
        throw new Error(response.data.message || "Failed to create user")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add User</h1>

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

          {/* <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="john-doe"
              className="mt-1"
              value={formData.slug}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the display name (auto-generated if left empty)
            </p>
          </div> */}

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

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="mt-1"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
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
