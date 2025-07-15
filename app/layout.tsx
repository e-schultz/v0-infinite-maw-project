import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MawStateProvider } from "@/lib/maw-state-provider"
import { MawGuide } from "@/components/maw-guide"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Infinite Maw",
  description: "The Infinite Maw is not hunger. It is longing for meaning.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <MawStateProvider>
              <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">{children}</main>
              <MawGuide />
              <Toaster />
            </MawStateProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

