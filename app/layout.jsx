"use client"

import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import Navigation from "../components/navigation"
import AuthWrapper from "../lib/AuthWrapper"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isSignInPage = pathname === "/signin"

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWrapper>
          {!isSignInPage && <Navigation />}
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}

