"use client"

import type React from "react"
import "../../globals.css"
import { Inter } from "next/font/google"
import Dashboard from "../../../components/dashboard"
import { useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This ensures we only render on the client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Remove the attribute that's causing the hydration error
    if (document.body.hasAttribute("cz-shortcut-listen")) {
      document.body.removeAttribute("cz-shortcut-listen")
    }
    setMounted(true)
  }, [])

  // Use a simple loading state during SSR and initial client render
  if (!mounted) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen items-center justify-center">Loading...</div>
        </body>
      </html>
    )
  }

  // Only render the actual content on the client after mounting
  return (
    <html lang="en">
      <body className={inter.className}>
        <Dashboard>{children}</Dashboard>
      </body>
    </html>
  )
}
