import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import Link from "next/link"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Search } from 'lucide-react'

const categories = [
  "Business",
  "Real Estate",
  "Family",
  "Estate Planning",
  "Financial",
]

const popularTemplates = [
  { name: "Lease Agreement", category: "Real Estate" },
  { name: "Non-Disclosure Agreement", category: "Business" },
  { name: "Last Will and Testament", category: "Estate Planning" },
  { name: "Power of Attorney", category: "Family" },
  { name: "Independent Contractor Agreement", category: "Business" },
  { name: "Promissory Note", category: "Financial" },
]

export default function Templates() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Legal Templates</h1>

      <div className="mb-8">
        <Label htmlFor="search" className="sr-only">Search templates</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="Search for templates..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link href="#" className="text-[#6B7CFF] hover:underline">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Popular Templates</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template) => (
              <Card key={template.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">{template.category}</p>
                  <Button asChild className="w-full">
                    <Link href="#">Use Template</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

