import Link from "next/link"

export function PremiumBanner() {
  return (
    <div className="mb-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 flex items-center justify-center gap-2">
      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-blue-600">
        Try premium features for free.{" "}
        <Link href="/pricing" className="font-medium underline">
          Upgrade now
        </Link>
      </p>
    </div>
  )
}

