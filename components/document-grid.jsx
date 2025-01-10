import { Building2, Home, FileText, TrendingUp, Tag, FileCheck } from 'lucide-react'
import Link from "next/link"

const documents = [
  {
    title: "Lease Agreement",
    icon: Building2,
    href: "/real-estate/leases"
  },
  {
    title: "Eviction Notice",
    icon: Home,
    href: "#"
  },
  {
    title: "Non-Disclosure Agreement",
    icon: FileText,
    href: "#"
  },
  {
    title: "Power of Attorney",
    icon: TrendingUp,
    href: "#"
  },
  {
    title: "Bill of Sale",
    icon: Tag,
    href: "#"
  },
  {
    title: "Last Will",
    icon: FileCheck,
    href: "#"
  }
]

export default function DocumentGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
      {documents.map((doc) => (
        <Link
          key={doc.title}
          href={doc.href}
          className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:border-[#6B7CFF] transition-colors"
        >
          <doc.icon className="h-8 w-8 text-[#6B7CFF] mb-3" />
          <span className="text-sm text-center text-gray-600">{doc.title}</span>
        </Link>
      ))}
    </div>
  )
}

