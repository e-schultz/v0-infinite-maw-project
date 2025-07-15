"use client"

import { useParams, useRouter } from "next/navigation"
import { useMawStore } from "@/lib/maw-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, Trash2, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { RitualFilter } from "@/components/ritual-filter"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { RitualHistory } from "@/components/ritual-history"
import { EditableArea } from "@/components/editable-area"

export default function VolumePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { reflections, updateReflection, deleteReflection, addRitualHistory } = useMawStore()
  const reflection = reflections.find((r) => r.id === id)

  const [isEditing, setIsEditing] = useState(false)
  const [editedInput, setEditedInput] = useState(reflection?.input || "")

  // State for editing processed output
  const [editedOutput, setEditedOutput] = useState(reflection?.processedOutput || "")
  const [hasOutputChanged, setHasOutputChanged] = useState(false)

  // Update editedOutput when reflection changes
  useEffect(() => {
    if (reflection?.processedOutput) {
      setEditedOutput(reflection.processedOutput)
      setHasOutputChanged(false)
    }
  }, [reflection?.processedOutput])

  if (!reflection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-400 mb-4">This reflection does not exist.</p>
        <Button asChild>
          <Link href="/volumes">Return to Volumes</Link>
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    updateReflection(id, { input: editedInput })
    setIsEditing(false)
  }

  // Handler for saving edited output
  const handleSaveOutput = () => {
    if (!hasOutputChanged) return

    // Store the current output before updating
    const beforeText = reflection.processedOutput || ""

    // Update the reflection with the edited output
    updateReflection(id, { processedOutput: editedOutput })

    // Get the last ritual type used (if any)
    const lastRitual =
      reflection.ritualHistory && reflection.ritualHistory.length > 0
        ? reflection.ritualHistory[reflection.ritualHistory.length - 1]
        : null

    const ritualType = lastRitual ? lastRitual.ritualType : "manual"

    // Add to ritual history with the manual edit flag
    addRitualHistory(id, {
      timestamp: new Date().toISOString(),
      ritualType,
      beforeText,
      afterText: editedOutput,
      isManualEdit: true,
    })

    setHasOutputChanged(false)
  }

  // Handler for output text changes
  const handleOutputChange = (value: string) => {
    setEditedOutput(value)
    if (value !== reflection.processedOutput) {
      setHasOutputChanged(true)
    } else {
      setHasOutputChanged(false)
    }
  }

  const handleDelete = () => {
    deleteReflection(id)
    router.push("/volumes")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/volumes" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Volumes</span>
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/volume/${id}/history`} className="text-gray-400 hover:text-white flex items-center gap-2">
              <Clock size={16} className="mr-2" />
              View Evolution
            </Link>
          </Button>

          {isEditing ? (
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          )}

          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="text-gray-400">
            {formatDate(reflection.date)}
          </Badge>

          <Badge
            className={`
              ${reflection.tone === "raw" ? "bg-blue-900" : ""}
              ${reflection.tone === "mirror" ? "bg-purple-900" : ""}
              ${reflection.tone === "devotional" ? "bg-amber-900" : ""}
              ${reflection.tone === "fractured" ? "bg-rose-900" : ""}
            `}
          >
            {reflection.tone}
          </Badge>

          {reflection.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {isEditing ? (
          <Textarea
            value={editedInput}
            onChange={(e) => setEditedInput(e.target.value)}
            className="min-h-[200px] text-lg font-serif bg-gray-900 border-gray-700"
          />
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-sm uppercase text-gray-500 mb-3">Original Reflection</h2>
              <p className="text-lg font-serif text-white whitespace-pre-wrap">{reflection.input}</p>
            </div>

            {reflection.processedOutput && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 relative">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm uppercase text-gray-500">
                    Processed Reflection {hasOutputChanged && <span className="text-rose-400 ml-2">(Edited)</span>}
                  </h2>

                  {/* Save button appears when changes are made */}
                  {hasOutputChanged && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveOutput}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/20"
                    >
                      <Save size={14} className="mr-1" />
                      Save Changes
                    </Button>
                  )}
                </div>

                <EditableArea
                  value={editedOutput}
                  onChange={handleOutputChange}
                  onSave={hasOutputChanged ? handleSaveOutput : undefined}
                  placeholder="Edit the processed reflection..."
                  hasChanged={hasOutputChanged}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-serif mb-4">Apply Ritual Filter</h2>
          <RitualFilter
            reflection={reflection}
            onApply={(processedOutput, ritualType, isManualEdit) => {
              // Store the current state before updating
              const beforeText = reflection.processedOutput || reflection.input

              // Update the reflection with the new processed output
              updateReflection(id, { processedOutput })

              // Add to ritual history
              addRitualHistory(id, {
                timestamp: new Date().toISOString(),
                ritualType: ritualType as any,
                beforeText,
                afterText: processedOutput,
                isManualEdit,
              })
            }}
          />
        </div>

        {/* Add the ritual history section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <RitualHistory history={reflection.ritualHistory || []} />
        </div>
      </div>
    </div>
  )
}

