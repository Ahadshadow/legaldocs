"use client"

import { useEffect, useState } from "react"
import { User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { getUserData, clearUserData } from "../lib/utils"
import { useAuth } from "../hooks/useAuth"

export default function UserDropdown() {
  const [userData, setUserData] = useState<{ email: string; name?: string } | null>(null)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn) {
      const data = getUserData()
      setUserData(data)
    } else {
      setUserData(null)
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    clearUserData()
    // Trigger a storage event to update other components
    window.dispatchEvent(new Event("storage"))
    window.location.href = "/"
  }

  if (!userData) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>{userData.name || userData.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>{userData.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

