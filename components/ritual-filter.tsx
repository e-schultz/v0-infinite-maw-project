"use client"

import { useState, useEffect } from "react"
import type { Reflection } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, ArrowLeftRight, Save, Code } from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { EditableArea } from "@/components/editable-area"
import { SystemInstructionsEditor } from "@/components/system-instructions-editor"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface RitualFilterProps {
  reflection: Reflection
  onApply: (processedOutput: string, ritualType: string, isManualEdit?: boolean) => void
}

export function RitualFilter({ reflection, onApply }: RitualFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>("mirrorTrace")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedText, setProcessedText] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [hasEdited, setHasEdited] = useState(false)
  const [systemInstructions, setSystemInstructions] = useState<Record<string, string>>({})
  const [isSystemOpen, setIsSystemOpen] = useState(false)

  // Add state to track which text source is selected
  const [selectedSource, setSelectedSource] = useState<"original" | "processed">(
    reflection.processedOutput ? "processed" : "original",
  )

  // Get the text to process based on the selected source
  const getTextToProcess = () => {
    if (selectedSource === "original" || !reflection.processedOutput) {
      return reflection.input
    } else {
      return reflection.processedOutput
    }
  }

  // Update editedText when processedText changes
  useEffect(() => {
    if (processedText) {
      setEditedText(processedText)
      setHasEdited(false)
    }
  }, [processedText])

  const applyFilter = async () => {
    setIsProcessing(true)
    setProcessedText(null)
    setError(null)

    try {
      const response = await fetch("/api/process-reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: getTextToProcess(),
          filter: activeFilter,
          systemInstructions: systemInstructions[activeFilter], // Pass custom instructions if available
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setProcessedText(data.processedText)
    } catch (error) {
      console.error("Error processing reflection:", error)
      setError("Failed to process reflection. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApply = () => {
    if (editedText) {
      // Pass the active filter type and a flag indicating if it was manually edited
      onApply(editedText, activeFilter, hasEdited)
    }
  }

  const handleTextChange = (value: string) => {
    setEditedText(value)
    // Only mark as edited if the text is different from the processed text
    if (processedText && value !== processedText) {
      setHasEdited(true)
    } else {
      setHasEdited(false)
    }
  }

  const handleSaveInstructions = (instructions: string) => {
    setSystemInstructions({
      ...systemInstructions,
      [activeFilter]: instructions,
    })
  }

  return (
    <div className="space-y-4">
      {/* Add source selection if processed output exists */}
      {reflection.processedOutput && (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium mb-3">Select text to process:</h3>
          <RadioGroup
            value={selectedSource}
            onValueChange={(value) => setSelectedSource(value as "original" | "processed")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="original" id="original" />
              <Label htmlFor="original" className="cursor-pointer">
                Original reflection
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="processed" id="processed" />
              <Label htmlFor="processed" className="cursor-pointer">
                Current processed output
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-3 flex items-center text-sm text-gray-400">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            <span>
              {selectedSource === "original"
                ? "Processing the original text"
                : "Building upon the previous ritual result"}
            </span>
          </div>
        </div>
      )}

      <Tabs defaultValue="mirrorTrace" onValueChange={setActiveFilter}>
        <TabsList className="grid grid-cols-4 bg-gray-900/80 border border-gray-800 rounded-md p-1">
          <TabsTrigger
            value="mirrorTrace"
            className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
          >
            <span className="mr-2">🪞</span>
            Mirror Trace
          </TabsTrigger>
          <TabsTrigger
            value="rufoTest"
            className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
          >
            <span className="mr-2">↔️</span>
            Rufo Test
          </TabsTrigger>
          <TabsTrigger
            value="oracleVoice"
            className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
          >
            <span className="mr-2">🎭</span>
            Oracle Voice
          </TabsTrigger>
          <TabsTrigger
            value="sigilMap"
            className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
          >
            <span className="mr-2">🏛️</span>
            Sigil Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mirrorTrace" className="text-gray-400 text-sm mt-2 italic">
          Reflective recursion: reveals unconscious thought forms, echoes, and dissonance.
        </TabsContent>
        <TabsContent value="rufoTest" className="text-gray-400 text-sm mt-2 italic">
          Persona reversal: reveals bias, blind spots, and ideological inversion (System 2 test).
        </TabsContent>
        <TabsContent value="oracleVoice" className="text-gray-400 text-sm mt-2 italic">
          Lyrical invocation: renders text as dream-logic, archetype, or poetic code.
        </TabsContent>
        <TabsContent value="sigilMap" className="text-gray-400 text-sm mt-2 italic">
          Structural trace: renders architecture of thought in patterns, themes, and logic flows.
        </TabsContent>
      </Tabs>

      {/* System Instructions Collapsible */}
      <Collapsible
        open={isSystemOpen}
        onOpenChange={setIsSystemOpen}
        className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Code className="h-5 w-5 mr-2 text-gray-400" />
            <h3 className="text-sm font-medium">System Instructions</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isSystemOpen ? "Hide Instructions" : "View Instructions"}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="p-4 pt-0">
          <SystemInstructionsEditor ritualType={activeFilter} onSave={handleSaveInstructions} />
        </CollapsibleContent>
      </Collapsible>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button onClick={applyFilter} disabled={isProcessing} className="bg-purple-900 hover:bg-purple-800 text-white">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Reflection"
          )}
        </Button>

        {processedText && (
          <Button
            onClick={handleApply}
            variant="outline"
            className={`border-gray-700 hover:border-gray-500 ${hasEdited ? "bg-rose-900/30 border-rose-800 hover:bg-rose-900/50" : ""}`}
          >
            {hasEdited && <Save size={16} className="mr-2" />}
            Apply to Reflection
          </Button>
        )}
      </div>

      {processedText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 p-4 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg shadow-lg hover:shadow-purple-900/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm uppercase text-gray-500 tracking-wider">
              {hasEdited ? "Edited Output" : "Processed Output"}
            </h3>
            {hasEdited && (
              <span className="text-xs text-rose-400 flex items-center">
                <Save size={12} className="mr-1" />
                Edited
              </span>
            )}
          </div>

          <EditableArea
            value={editedText}
            onChange={handleTextChange}
            onSave={hasEdited ? handleApply : undefined}
            placeholder="Edit the processed text..."
            hasChanged={hasEdited}
          />
        </motion.div>
      )}
    </div>
  )
}

