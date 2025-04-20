"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Plus } from "lucide-react"
import DataTable from "../../../../../components/admin/data-table"
import { Button } from "../../../../../components/ui/button"
import { toast } from "../../../../../components/ui/use-toast"

export default function UsersList() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

   async function deleteUser(id: string) {
    console.log("Deleting user:", id)
    // Replace with actual API call
    return { success: true }
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
    const loadUsers = async () => {
      try {
        const data = await fetchUsers()
        setUsers(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteUser(item.id)
        setUsers(users.filter((user: any) => user.id !== item.id))
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  const columns = [
    { key: "name", label: "NAME" },
    { key: "slug", label: "SLUG" },
    { key: "email", label: "EMAIL" },
    { key: "phone", label: "PHONE" },
    { key: "type", label: "TYPE" },
  ]

  const actions = [
    {
      label: "Edit",
      color: "orange",
      onClick: (item: any) => router.push(`/admin/users/edit/${item.id}`),
    },
    {
      label: "Delete",
      color: "red",
      onClick: handleDelete,
    },
  ]

  if (isLoading) {
    return <div className="p-6 text-center">Loading users...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Users List</h1>
          <Button onClick={() => router.push("/admin/users/add")} className="bg-black hover:bg-black/90">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <DataTable title="Users" columns={columns} data={users} actions={actions} />
      </div>
    </div>
  )
}
