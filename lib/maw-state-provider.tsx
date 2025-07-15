"use client"

import type { ReactNode } from "react"

interface MawStateProviderProps {
  children: ReactNode
}

export function MawStateProvider({ children }: MawStateProviderProps) {
  return children
}

