"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"
import { Search } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu"
import { navigationData } from "../data/navigation-data"
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
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
                {navigationData.map((section) => (
                  <NavigationMenuItem key={section.name}>
                    <NavigationMenuTrigger>{section.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                        {section.categories.map((category) => (
                          <div key={category.id} className="space-y-4">
                            <Link
                              href={category.href}
                              className="block p-3 space-y-1 rounded-lg hover:bg-accent"
                            >
                              <div className="font-medium leading-none">{category.name}</div>
                              {category.description && (
                                <div className="text-sm text-muted-foreground">
                                  {category.description}
                                </div>
                              )}
                            </Link>
                            <div className="pl-3 space-y-2">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={subcategory.href}
                                  className="block text-sm hover:text-[#6B7CFF]"
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <Link href="/templates" className={`text-sm font-medium ${pathname === '/templates' ? 'text-[#6B7CFF]' : 'text-gray-600 hover:text-gray-900'}`}>
                    Templates
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pricing" className={`text-sm font-medium ${pathname === '/pricing' ? 'text-[#6B7CFF]' : 'text-gray-600 hover:text-gray-900'}`}>
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin" className={pathname === '/signin' ? 'text-[#6B7CFF]' : ''}>Sign In</Link>
            </Button>
            <Button size="sm" className="bg-[#6B7CFF] hover:bg-[#5A6AE6]" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

