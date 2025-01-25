"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Settings, Building2, Receipt, Palette, LogOut } from "lucide-react"
import { getUserData, clearUserData } from "../lib/utils"
import { useAuth } from "../hooks/useAuth"

export default function UserDropdown() {
  const [userData, setUserData] = useState<{ email: string; name?: string } | null>(null)
  const { isLoggedIn } = useAuth()
  const router = useRouter()

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
    router.push("/")
  }

  if (!userData) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{userData.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-2 p-4">
          <Avatar>
            <AvatarFallback>{userData.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm">{userData.email}</p>
            <Link href="/pricing" className="text-sm text-blue-600">
              Upgrade Plan
            </Link>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="app/user-panel/documents" className="flex w-full items-center">
            <Building2 className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="app/user-panel/settings/user" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>User Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="app/user-panel/billing" className="flex w-full items-center">
            <Receipt className="mr-2 h-4 w-4" />
            <span>Billing History</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

