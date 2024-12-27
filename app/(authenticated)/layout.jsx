import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function AuthenticatedLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Account</h1>
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

