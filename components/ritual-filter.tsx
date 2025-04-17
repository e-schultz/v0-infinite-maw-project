"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useMawStore } from "@/lib/maw-store"
import { ritualService, getAllRituals } from "@/lib/rituals"
import type { RitualType } from "@/lib/rituals"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Reflection } from "@/lib/types"

interface RitualFilterProps {
  reflection: Reflection
  onApply: (processedOutput: string) => void
}

export function RitualFilter({ reflection, onApply }: RitualFilterProps) {
  // Get all available rituals from the registry
  const availableRituals = getAllRituals()

  // Get ritual processing state from the store
  const {
    ritualProcessing,
    setRitualProcessing,
    setRitualError,
    setActiveReflection,
    setProcessedOutput,
    resetRitualState,
  } = useMawStore((state) => ({
    ritualProcessing: state.ritualProcessing,
    setRitualProcessing: state.setRitualProcessing,
    setRitualError: state.setRitualError,
    setActiveReflection: state.setActiveReflection,
    setProcessedOutput: state.setProcessedOutput,
    resetRitualState: state.resetRitualState,
  }))

  // Local state for the active ritual type
  const [activeRitualType, setActiveRitualType] = useState<RitualType>("mirror")

  // Reset ritual state when component unmounts
  useEffect(() => {
    return () => {
      resetRitualState()
    }
  }, [resetRitualState])

  // Process the reflection with the selected ritual
  const processReflection = async () => {
    try {
      // Update state to indicate processing
      setRitualProcessing(true)
      setActiveReflection(reflection.id, activeRitualType)
      setProcessedOutput(null)

      // Call the ritual service to process the reflection
      const result = await ritualService.processReflection({
        text: reflection.input,
        ritualType: activeRitualType,
      })

      // Update state with the processed output
      setProcessedOutput(result.processedText)
    } catch (error) {
      console.error("Error processing reflection:", error)
      setRitualError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setRitualProcessing(false)
    }
  }

  // Apply the processed output to the reflection
  const handleApply = () => {
    if (ritualProcessing.processedOutput) {
      onApply(ritualProcessing.processedOutput)
      resetRitualState()
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="mirror" onValueChange={(value) => setActiveRitualType(value as RitualType)}>
        <TabsList className="grid grid-cols-4 bg-gray-900">
          {availableRituals.map((ritual) => (
            <TabsTrigger key={ritual.id} value={ritual.id}>
              {ritual.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableRituals.map((ritual) => (
          <TabsContent key={ritual.id} value={ritual.id} className="text-gray-400 text-sm">
            {ritual.description}
          </TabsContent>
        ))}
      </Tabs>

      {ritualProcessing.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{ritualProcessing.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={processReflection}
          disabled={ritualProcessing.isProcessing}
          className="bg-purple-900 hover:bg-purple-800"
        >
          {ritualProcessing.isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Reflection"
          )}
        </Button>

        {ritualProcessing.processedOutput && (
          <Button onClick={handleApply} variant="outline">
            Apply to Reflection
          </Button>
        )}
      </div>

      {ritualProcessing.processedOutput && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <h3 className="text-sm uppercase text-gray-500 mb-2">Processed Output</h3>
          <p className="font-serif whitespace-pre-wrap">{ritualProcessing.processedOutput}</p>
        </motion.div>
      )}
    </div>
  )
}

