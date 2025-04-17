"use client"

import { useState } from "react"
import { useMawStore } from "@/lib/store"
import { ritualDefinitions } from "@/lib/rituals"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { RitualType } from "@/lib/types"

export default function TestPage() {
  const [input, setInput] = useState("")
  const [selectedRitual, setSelectedRitual] = useState<RitualType>("mirror")
  const { processWithRitual, currentProcessing, addReflection, updateReflection, resetProcessingState } = useMawStore()

  const handleProcess = async () => {
    if (!input.trim()) return

    try {
      await processWithRitual(input, selectedRitual)
    } catch (error) {
      // Error is handled in the store
      console.error("Failed to process:", error)
    }
  }

  const handleSave = () => {
    if (!input.trim() || !currentProcessing.output) return

    const id = addReflection(input)
    updateReflection(id, {
      processedOutput: currentProcessing.output,
      tone: (currentProcessing.activeRitualType as any) || "raw",
    })

    resetProcessingState()
    setInput("")

    alert(`Saved reflection with ID: ${id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
        </Button>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-serif text-center">Test Ritual Processing</h1>
          <p className="text-gray-400 text-center mb-8">
            This page demonstrates the new architecture for ritual processing.
          </p>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Enter your reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your thoughts here..."
                className="min-h-[150px] bg-gray-800 border-gray-700 font-serif"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-serif">Select a ritual:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ritualDefinitions.map((ritual) => (
                <Button
                  key={ritual.id}
                  variant={selectedRitual === ritual.id ? "default" : "outline"}
                  onClick={() => setSelectedRitual(ritual.id)}
                  className={selectedRitual === ritual.id ? "bg-purple-900 hover:bg-purple-800" : ""}
                >
                  <span className="mr-2">{ritual.icon}</span> {ritual.name}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleProcess}
            disabled={!input.trim() || currentProcessing.isLoading}
            className="w-full bg-purple-900 hover:bg-purple-800"
          >
            {currentProcessing.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Reflection"
            )}
          </Button>

          {currentProcessing.error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-md text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>Error: {currentProcessing.error}</span>
              </div>
            </div>
          )}

          {currentProcessing.output && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Processed Output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-md whitespace-pre-wrap font-serif">
                  {currentProcessing.output}
                </div>

                <Button onClick={handleSave} className="w-full">
                  <Save size={16} className="mr-2" />
                  Save as Reflection
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

