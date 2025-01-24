// import { Inter } from "next/font/google"
// import { Toaster } from "sonner"
// import "../../../globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Your App Title",
//   description: "Your app description",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className={inter.className}>
//       <body>
//         {children}
//         <Toaster />
//       </body>
//     </html>
//   )
// }


import { Inter } from 'next/font/google'
import '../../../../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lease Agreement Form',
  description: 'Create your lease agreement',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

