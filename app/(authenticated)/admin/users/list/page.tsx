"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import DataTable from "../../../../../components/admin/data-table"
import { Button } from "../../../../../components/ui/button"
import { SC } from "../../../../../service/Api/serverCall"
import { CustomPagination } from "../../../../../components/ui/custom-pagination"
import { useToast } from "@/adminComponents/ui/use-toast"

export default function UsersList() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  })
  const { toast } = useToast()


  useEffect(() => {
    loadUsers(pagination.currentPage)
  }, [])

  const loadUsers = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await SC.getCall({ url: `users?page=${page}` })

      if (response.status === 200 && response.data.data) {
        // Extract pagination data from response
        const { current_page, last_page, per_page, total, data: usersData } = response.data.data

        // Update pagination state
        setPagination({
          currentPage: current_page,
          totalPages: last_page,
          perPage: per_page,
          total: total,
        })

        // Format the data to match the expected structure for the DataTable
        const formattedUsers = usersData.map((user: any) => ({
          id: user._id || user.id,
          name: user.displayName || `${user.first_name} ${user.last_name}`.trim(),
          slug: user.slug || "",
          email: user.email || "",
          phone: user.phone || "N/A",
          type: user.type || "User",
        }))

        setUsers(formattedUsers)
      } else {
        throw new Error("Failed to load users or invalid response format")
      }
    } catch (error: any) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      })
      // Set empty array to avoid undefined errors
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadUsers(page)
  }

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        const response = await SC.deleteCall({ url: `users/${item.id}` })

        if (response.status === 204) {
          // Reload the current page after deletion
          loadUsers(pagination.currentPage)

          toast({
            title: "Success",
            description: "User deleted successfully",
          })
        } else {
          throw new Error(response.data.message || "Failed to delete user")
        }
      } catch (error: any) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  const columns = [
    { key: "name", label: "NAME" },
    // { key: "slug", label: "SLUG" },
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

  if (isLoading && pagination.currentPage === 1) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
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

        {users.length === 0 && !isLoading ? (
          <div className="text-center p-8 border rounded-md bg-muted/50">
            <p className="text-muted-foreground mb-4">No users found</p>
            <Button onClick={() => router.push("/admin/users/add")} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add your first user
            </Button>
          </div>
        ) : (
          <>
            <DataTable
              title="Users"
              columns={columns}
              data={users}
              actions={actions}
              showPagination={false} // We're using our custom pagination
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <CustomPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  showFirstLast={true}
                  maxPageButtons={5}
                />
              </div>
            )}

            {/* Pagination summary */}
            <div className="mt-2 text-sm text-gray-500 text-center">
              Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} entries
            </div>
          </>
        )}
      </div>
    </div>
  )
}
