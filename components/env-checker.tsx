"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EnvChecker() {
  const [missingEnvVars, setMissingEnvVars] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkEnv() {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()

        if (data.missingEnvVars && data.missingEnvVars.length > 0) {
          setMissingEnvVars(data.missingEnvVars)
        }
      } catch (error) {
        console.error("Failed to check environment variables:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkEnv()
  }, [])

  if (isChecking || missingEnvVars.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuration Error</AlertTitle>
      <AlertDescription>
        <p>The following environment variables are missing:</p>
        <ul className="list-disc pl-5 mt-2">
          {missingEnvVars.map((envVar) => (
            <li key={envVar}>{envVar}</li>
          ))}
        </ul>
        <p className="mt-2">
          Please add these to your .env.local file or Vercel environment variables to enable all features.
        </p>
      </AlertDescription>
    </Alert>
  )
}

