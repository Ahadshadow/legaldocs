// 'use client'

// import type React from "react"
// import "../../globals.css"
// import { Inter } from "next/font/google"
// import Dashboard from "../../../components/dashboard"
// // import Navigation from "../../../components/navigation"

// const inter = Inter({ subsets: ["latin"] })


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//           <Dashboard>{children}</Dashboard>
//       </body>
//     </html>
//   )
// }



import type React from "react"
import "../../globals.css"
import { Inter } from "next/font/google"
import Dashboard from "../../../components/dashboard"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Dashboard>{children}</Dashboard>
      </body>
    </html>
  )
}

