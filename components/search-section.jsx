import { Search } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import Link from "next/link"

export default function SearchSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Find Your Document</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search documents and forms (e.g. lease agreement)"
                className="w-full pl-4 pr-10 py-3"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6]">
              Search
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="#" className="text-[#6B7CFF] hover:underline">Late Rent Notice</Link>
            <span className="text-gray-400">|</span>
            <Link href="#" className="text-[#6B7CFF] hover:underline">Room Rental Agreement</Link>
            <span className="text-gray-400">|</span>
            <Link href="#" className="text-[#6B7CFF] hover:underline">Quitclaim Deed</Link>
            <span className="text-gray-400">|</span>
            <Link href="#" className="text-[#6B7CFF] hover:underline">Medical Power of Attorney</Link>
            <span className="text-gray-400">|</span>
            <Link href="#" className="text-[#6B7CFF] hover:underline">NDA</Link>
            <span className="text-gray-400">|</span>
            <Link href="#" className="text-[#6B7CFF] hover:underline">+ More</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

