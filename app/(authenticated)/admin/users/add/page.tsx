"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { toast } from "../../../../../components/ui/use-toast"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue  } from "../../../../../components/ui/select"

export default function AddUser() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    type: "User",
    password: "",
    slug: "",
  })

   async function createUser(data: any) {
    console.log("Creating user:", data)
    // Replace with actual API call
    return { id: Date.now().toString(), ...data, slug: data.displayName.toLowerCase().replace(/\s+/g, "-") }
  }
  
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
      await createUser(formData)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      router.push("/admin/users/list")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
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
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the display name (auto-generated if left empty)
            </p>
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

          <Button type="submit" className="bg-black hover:bg-black/90" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  )
}
