"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Search } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"
import { usePathname } from "next/navigation"
import UserDropdown from "./UserDropdown"
import { useAuth } from "../hooks/useAuth"
import { getCategories, getSubcategoriesByCategoryId } from "../service/navigationService"

export default function Navigation() {
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading categories:", err)
        setCategories([])
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchSubcategories() {
      if (selectedCategory) {
        try {
          const fetchedSubcategories = await getSubcategoriesByCategoryId(selectedCategory.id)
          setSubcategories(fetchedSubcategories)
        } catch (err) {
          console.error("Error loading subcategories:", err)
          setSubcategories([])
        }
      } else {
        setSubcategories([])
      }
    }

    fetchSubcategories()
  }, [selectedCategory])

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const renderNavigationContent = () => {
    if (isLoading) {
      return (
        <NavigationMenuItem>
          <NavigationMenuTrigger>Legal Documents</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4">Loading categories...</div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      )
    }

    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>Legal Documents</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium">Categories</h3>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className={`cursor-pointer p-2 rounded-lg ${selectedCategory?.id === category.id ? "bg-accent" : "hover:bg-accent"}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No categories available</div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Subcategories</h3>
              {selectedCategory ? (
                subcategories.length > 0 ? (
                  subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={subcategory.href}
                      className="block p-2 text-sm hover:text-[#6B7CFF]"
                    >
                      {subcategory.name}
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No subcategories available</div>
                )
              ) : (
                <div className="text-sm text-gray-500">Select a category to view subcategories</div>
              )}
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              legaltemplates.
            </Link>
            <NavigationMenu className="hidden md:flex ml-10">
              <NavigationMenuList>
                {renderNavigationContent()}
                <NavigationMenuItem>
                  <Link
                    href="/templates"
                    className={`text-sm font-medium ${pathname === "/templates" ? "text-[#6B7CFF]" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Templates
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/pricing"
                    className={`text-sm font-medium ${pathname === "/pricing" ? "text-[#6B7CFF]" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/support">Support</Link>
            </Button>
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin" className={pathname === "/signin" ? "text-[#6B7CFF]" : ""}>
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="bg-[#6B7CFF] hover:bg-[#5A6AE6]" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

