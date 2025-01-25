"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PropTypes from "prop-types"
import { Button } from "../components/ui/button"
import { Search } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu"
import { usePathname } from "next/navigation"
import UserDropdown from "../components/UserDropdown"
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
  const router = useRouter()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories()
        if (response && response.status) {
          setCategories(response.data || [])
        } else {
          setCategories([])
        }
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading categories:", err)
        setCategories([])
        setError("Failed to load categories")
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchSubcategories() {
      if (selectedCategory && selectedCategory._id) {
        try {
          const response = await getSubcategoriesByCategoryId(selectedCategory._id)
          if (response && response.status) {
            setSubcategories(response.data || [])
          } else {
            setSubcategories([])
          }
        } catch (err) {
          console.error("Error loading subcategories:", err)
          setSubcategories([])
          setError("Failed to load subcategories")
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

  const handleSubcategorySelect = (subcategory) => {
    if (subcategory && subcategory.name && selectedCategory && selectedCategory.name) {
      const categorySlug = selectedCategory.name.toLowerCase().replace(/\s+/g, "-")
      const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, "-")
      router.push(`/${categorySlug}/${subcategorySlug}`)
    }
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

    if (error) {
      return (
        <NavigationMenuItem>
          <NavigationMenuTrigger>Legal Documents</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 text-red-500">{error}</div>
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
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category._id}
                    className={`cursor-pointer p-2 rounded-lg ${selectedCategory?._id === category._id ? "bg-accent" : "hover:bg-accent"}`}
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
                subcategories && subcategories.length > 0 ? (
                  subcategories.map((subcategory) => (
                    <div
                      key={subcategory._id}
                      className="block p-2 text-sm hover:text-[#6B7CFF] cursor-pointer"
                      onClick={() => handleSubcategorySelect(subcategory)}
                    >
                      {subcategory.name}
                    </div>
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

Navigation.propTypes = {
  // Add any props if needed
}

