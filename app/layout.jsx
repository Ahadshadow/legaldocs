"use client"

import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import Navigation from "../components/navigation"
import AuthWrapper from "../lib/AuthWrapper"
import { Button } from "../components/ui/button"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const hideNavigation = pathname === "/signin" || pathname.includes("user-panel")

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWrapper>  
          {!hideNavigation && <Navigation />}
          {!hideNavigation && (
            <header className="bg-gray-900 text-white p-4 flex justify-center items-center">
              <div className="flex items-center gap-4">
                <p>Would you like to continue working on your Employee Non-Disclosure Agreement?</p>
                <Button style={{ backgroundColor: "#6366F1", hover: { backgroundColor: "#4F46E5" } }}>
  Continue Editing
</Button>
              </div>
            </header>
          )}
        
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}