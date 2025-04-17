"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ritualDefinitions } from "@/lib/rituals"
import { ritualService } from "@/lib/rituals"
import type { RitualType } from "@/lib/types"

interface RitualFilterNewProps {
  reflectionId: string
  reflectionText: string
  onApply: (processedOutput: string) => void
}

export function RitualFilterNew({ reflectionId, reflectionText, onApply }: RitualFilterNewProps) {
  // Local state
  const [activeRitualType, setActiveRitualType] = useState<RitualType>("mirror")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)

  // Handle ritual type change
  const handleRitualChange = useCallback((value: string) => {
    setActiveRitualType(value as RitualType)
    // Reset output when changing ritual type
    setOutput(null)
    setError(null)
  }, [])

  // Process the reflection
  const processReflection = useCallback(async () => {
    if (isProcessing || !reflectionText) return

    setIsProcessing(true)
    setError(null)

    try {
      const result = await ritualService.processReflection(reflectionText, activeRitualType)
      setOutput(result.processedText)
    } catch (error) {
      console.error("Error processing reflection:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsProcessing(false)
    }
  }, [reflectionText, activeRitualType, isProcessing])

  // Apply the processed output
  const handleApply = useCallback(() => {
    if (output) {
      onApply(output)
      setOutput(null)
    }
  }, [output, onApply])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="mirror" onValueChange={handleRitualChange} className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-900/80 border border-gray-800 rounded-md p-1">
          {ritualDefinitions.map((ritual) => (
            <TabsTrigger
              key={ritual.id}
              value={ritual.id}
              className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
            >
              <span className="mr-2">{ritual.icon}</span>
              {ritual.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {ritualDefinitions.map((ritual) => (
          <TabsContent key={ritual.id} value={ritual.id} className="text-gray-400 text-sm mt-2 italic">
            {ritual.description}
          </TabsContent>
        ))}
      </Tabs>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button onClick={processReflection} disabled={isProcessing} className="maw-button-primary">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Reflection"
          )}
        </Button>

        {output && (
          <Button onClick={handleApply} variant="outline" className="maw-button-secondary">
            Apply to Reflection
          </Button>
        )}
      </div>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 p-4 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg shadow-lg hover:shadow-purple-900/10 transition-all duration-300"
        >
          <h3 className="text-sm uppercase text-gray-500 mb-2 tracking-wider">Processed Output</h3>
          <p className="font-serif whitespace-pre-wrap">{output}</p>
        </motion.div>
      )}
    </div>
  )
}

