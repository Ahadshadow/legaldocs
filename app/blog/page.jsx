import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Search } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "Understanding Non-Disclosure Agreements",
    excerpt: "Learn about the key components of NDAs and when to use them in your business dealings.",
    date: "2023-06-15",
    author: "Jane Doe",
    category: "Business",
  },
  {
    id: 2,
    title: "The Importance of Having a Will",
    excerpt: "Discover why creating a will is crucial for protecting your assets and loved ones.",
    date: "2023-06-10",
    author: "John Smith",
    category: "Personal",
  },
  {
    id: 3,
    title: "Navigating Rental Agreements: Tips for Landlords",
    excerpt: "Essential advice for property owners on creating comprehensive and fair rental agreements.",
    date: "2023-06-05",
    author: "Emily Johnson",
    category: "Real Estate",
  },
  {
    id: 4,
    title: "Intellectual Property Rights for Small Businesses",
    excerpt: "A guide to understanding and protecting your business's intellectual property.",
    date: "2023-05-30",
    author: "Michael Brown",
    category: "Business",
  },
  {
    id: 5,
    title: "Estate Planning 101: What You Need to Know",
    excerpt: "An introduction to estate planning and why it's important for everyone.",
    date: "2023-05-25",
    author: "Sarah Lee",
    category: "Personal",
  },
  {
    id: 6,
    title: "Navigating Employment Contracts: A Guide for Employers",
    excerpt: "Key considerations when drafting and negotiating employment contracts.",
    date: "2023-05-20",
    author: "David Wilson",
    category: "Business",
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Legal Templates Blog</h1>
        <div className="max-w-xl mx-auto mb-12">
          <Label htmlFor="search" className="sr-only">Search blog posts</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search blog posts..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-white">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.date} | {post.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full hover:bg-[#6B7CFF] hover:text-white">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6] text-white">
            View All Posts
          </Button>
        </div>
      </div>
    </div>
  )
}

