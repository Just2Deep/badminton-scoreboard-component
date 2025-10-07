import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Badminton App",
  description: "Created with Love",
  generator: "SuperClan",
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans ${inter.variable} h-full`}>{children}</body>
    </html>
  )
}
