"use client"

import { useParams, useRouter } from "next/navigation"
import { useMawStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { RitualFilterNew } from "@/components/ritual-filter-new"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"
import { MawVisual } from "@/components/maw-visual"
import { DebugButton } from "@/components/debug-button"
import type { Reflection } from "@/lib/types"

export default function VolumePage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === "string" ? params.id : ""

  // Get reflections and actions from store
  const reflections = useMawStore((state) => state.reflections)
  const updateReflection = useMawStore((state) => state.updateReflection)
  const deleteReflection = useMawStore((state) => state.deleteReflection)

  // Local state
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInput, setEditedInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Find the reflection once when the component mounts or id changes
  useEffect(() => {
    console.log(`Loading reflection with ID: ${id}`)

    if (id) {
      const found = reflections.find((r) => r.id === id) || null
      setReflection(found)
      if (found) {
        setEditedInput(found.input)
        console.log(`Found reflection:`, found)
      } else {
        console.log(`Reflection not found with ID: ${id}`)
      }
      setIsLoading(false)
    }
  }, [id, reflections])

  // Memoize handlers to prevent recreating them on each render
  const handleSave = useCallback(() => {
    if (id && editedInput) {
      updateReflection(id, { input: editedInput })
      setIsEditing(false)
    }
  }, [id, editedInput, updateReflection])

  const handleDelete = useCallback(() => {
    if (id) {
      deleteReflection(id)
      router.push("/volumes")
    }
  }, [id, deleteReflection, router])

  const handleApplyRitual = useCallback(
    (processedOutput: string) => {
      console.log(`Applying processed output to reflection: ${id}`)

      if (id) {
        updateReflection(id, { processedOutput })
      }
    },
    [id, updateReflection],
  )

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="fixed inset-0 w-full h-full bg-[#13111c] z-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <MawVisual size={900} intensity={1.2} />
          </div>
        </div>
        <div className="relative z-10 animate-pulse text-gray-400">
          <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading volume...</p>
        </div>
      </div>
    )
  }

  // Handle not found case
  if (!reflection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div className="fixed inset-0 w-full h-full bg-[#13111c] z-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <MawVisual size={900} intensity={1.2} />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <p className="text-gray-400 mb-4">This reflection does not exist.</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/volumes">Return to Volumes</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fixed background that covers the entire viewport */}
      <div className="fixed inset-0 w-full h-full bg-[#13111c] z-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <MawVisual size={900} intensity={1.2} />
        </div>
      </div>

      {/* Content with relative positioning to appear above the background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.header
          className="p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <Link href="/volumes" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Back to Volumes</span>
            </Link>
          </Button>

          <div className="flex gap-2">
            {isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="border-gray-700 hover:border-gray-500 transition-colors duration-300"
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-gray-700 hover:border-gray-500 transition-colors duration-300"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="hover:bg-red-800 transition-colors duration-300"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </motion.header>

        <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <motion.div
            className="mb-6 flex flex-wrap gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              {formatDate(reflection.date)}
            </Badge>

            <Badge
              className={`
                ${reflection.tone === "raw" ? "bg-blue-900 hover:bg-blue-800" : ""}
                ${reflection.tone === "mirror" ? "bg-purple-900 hover:bg-purple-800" : ""}
                ${reflection.tone === "devotional" ? "bg-amber-900 hover:bg-amber-800" : ""}
                ${reflection.tone === "fractured" ? "bg-rose-900 hover:bg-rose-800" : ""}
                transition-colors duration-300
              `}
            >
              {reflection.tone}
            </Badge>

            {reflection.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
              >
                {tag}
              </Badge>
            ))}
          </motion.div>

          {isEditing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Textarea
                value={editedInput}
                onChange={(e) => setEditedInput(e.target.value)}
                className="min-h-[200px] text-lg font-serif bg-gray-900/95 text-white border-gray-700 rounded-lg shadow-inner focus:border-purple-700 transition-all duration-300"
              />
            </motion.div>
          ) : (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg hover:shadow-purple-900/10 transition-all duration-300 hover:border-gray-700">
                <h2 className="text-sm uppercase text-gray-500 mb-3 tracking-wider">Original Reflection</h2>
                <p className="text-lg font-serif text-white whitespace-pre-wrap">{reflection.input}</p>
              </div>

              {reflection.processedOutput && (
                <motion.div
                  className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg hover:shadow-purple-900/10 transition-all duration-300 hover:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-sm uppercase text-gray-500 mb-3 tracking-wider">Processed Reflection</h2>
                  <p className="text-lg font-serif text-white whitespace-pre-wrap">{reflection.processedOutput}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {!isEditing && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="text-xl font-serif mb-4 text-white">Apply Ritual Filter</h2>
              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg transition-all duration-300 hover:border-gray-700">
                {/* Ensure we're passing the required props */}
                {reflection && (
                  <RitualFilterNew
                    reflectionId={reflection.id}
                    reflectionText={reflection.input}
                    onApply={handleApplyRitual}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add the debug button */}
      <DebugButton />
    </div>
  )
}

