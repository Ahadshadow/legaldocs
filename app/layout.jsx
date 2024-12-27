"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Legal Templates',
//   description: 'Create Your Free Legal Documents & Contracts Online in Minutes',
// }

export default function RootLayout({
  children,
}) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body className={inter.className}>
        {!pathname.startsWith('/signin') && !pathname.startsWith('/signup') && !pathname.startsWith('/forgot-password') && <Navigation />}
        {children}
        <Footer />
      </body>
    </html>
  )
}

