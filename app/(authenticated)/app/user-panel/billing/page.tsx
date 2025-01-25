"use client"

import Layout from "../../../../../components/layout"
import Link from "next/link"
import { PremiumBanner } from "../../../../../components/premium-banner"

export default function BillingHistoryPage() {
  return (
    <Layout>
      {/* Premium Banner */}
      <PremiumBanner />

      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full mx-auto">Billing History</h1>

        <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-12 space-y-8 min-h-[calc(100vh-14rem)]">
          <p className="text-gray-600">
            No transactions found. Let us help you with your legal needs,{" "}
            <Link href="/pricing" className="text-blue-600 hover:underline">
              upgrade your account
            </Link>{" "}
            today!
          </p>
        </div>
      </div>
    </Layout>
  )
}

