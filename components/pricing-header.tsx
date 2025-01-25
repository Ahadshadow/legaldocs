import Link from "next/link"

export default function PricingHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-semibold text-xl">
          legaltemplates.
        </Link>
      </div>
    </header>
  )
}

