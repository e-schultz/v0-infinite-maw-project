import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface HomeButtonProps {
  href: string
  variant: "primary" | "secondary"
  children: React.ReactNode
  className?: string
}

export function HomeButton({ href, variant, children, className }: HomeButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-medium transition-all duration-200 shadow-lg",
        variant === "primary"
          ? "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-900/50"
          : "bg-white text-gray-900 hover:bg-gray-100",
        className,
      )}
    >
      {children}
    </Link>
  )
}

