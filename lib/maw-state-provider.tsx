"use client"

import { type ReactNode, useEffect, useState } from "react"
import { ritualService } from "./rituals"

interface MawStateProviderProps {
  children: ReactNode
}

export function MawStateProvider({ children }: MawStateProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize any global state or services here
  useEffect(() => {
    // Configure ritual service
    ritualService.updateConfig({
      useMockImplementation: true, // Use mock implementation by default
      mockDelay: 1000, // Reduce mock delay for better UX
    })

    setIsInitialized(true)
  }, [])

  if (!isInitialized) {
    // You could add a loading indicator here if needed
    return null
  }

  return <>{children}</>
}

