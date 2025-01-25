"use client"

import Layout from "../../../../../components/layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/tablePanel"
import { PremiumBanner } from "../../../../../components/premium-banner"

export default function TrashPage() {
  return (
    <Layout>
      <PremiumBanner />

      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trash</h1>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Documents that have been in Trash more than 30 days will be automatically deleted forever.
          </p>
        </div>

        {/* Documents Table */}
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-500">Name</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">
                  Last Updated
                  <svg className="ml-1 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Owner</TableHead>
                <TableHead className="text-right text-xs font-medium text-gray-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  No documents found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  )
}

