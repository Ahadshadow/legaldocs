"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  const [subLoading, setSubLoading] = useState(false) // New state for subcategories loading
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
        setSubLoading(true) // Start loading
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
        setSubLoading(false) // Stop loading
      } else {
        setSubcategories([])
      }
    }
    fetchSubcategories()
  }, [selectedCategory])

  const handleCategorySelect = (category) => {
    setSelectedCategory(category) // Set category when hovering
  }

  const handleSubcategorySelect = (subcategory) => {
    if (subcategory && subcategory.name && selectedCategory && selectedCategory.name) {
      const categorySlug = selectedCategory.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\//g, ""); // Remove slashes
  
      const subcategorySlug = subcategory.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\//g, ""); // Remove slashes
  
      // Manually construct the query string
      const queryString = `?subcategoryId=${subcategory._id}`;
  
      router.push(`/${categorySlug}/${subcategorySlug}${queryString}`);
    }
  };
  

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
                {categories.map((category) => (
                  <NavigationMenuItem key={category._id}>
                    <NavigationMenuTrigger onMouseEnter={() => handleCategorySelect(category)}>
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-64">
                        {subLoading ? (
                          <div className="text-sm text-gray-500">Loading...</div>
                        ) : subcategories.length > 0 ? (
                          subcategories.map((subcategory) => (
                            <div
                              key={subcategory._id}
                              className="p-2 cursor-pointer hover:text-[#6B7CFF]"
                              onClick={() => handleSubcategorySelect(subcategory)}
                            >
                              {subcategory.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No subcategories available</div>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            {/* <Button variant="ghost" size="sm" asChild>
              <Link href="/support">Support</Link>
            </Button> */}
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
