"use client"

import { useParams, useRouter } from "next/navigation"
import { useMawStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { RitualFilterNew } from "@/components/ritual-filter-new"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default function VolumePageNew() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Get reflections from store
  const { reflections, updateReflection, deleteReflection } = useMawStore((state) => ({
    reflections: state.reflections,
    updateReflection: state.updateReflection,
    deleteReflection: state.deleteReflection,
  }))

  // Find the current reflection
  const [reflection, setReflection] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInput, setEditedInput] = useState("")

  // Load reflection data
  useEffect(() => {
    const foundReflection = reflections.find((r) => r.id === id)
    if (foundReflection) {
      setReflection(foundReflection)
      setEditedInput(foundReflection.input || "")
    }
  }, [id, reflections])

  // Handle not found case
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

  const handleDelete = () => {
    deleteReflection(id)
    router.push("/volumes")
  }

  const handleApplyRitual = (processedOutput: string) => {
    updateReflection(id, { processedOutput })
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

          {reflection.tags.map((tag: string) => (
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
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-sm uppercase text-gray-500 mb-3">Processed Reflection</h2>
                <p className="text-lg font-serif text-white whitespace-pre-wrap">{reflection.processedOutput}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-serif mb-4">Apply Ritual Filter</h2>
          <RitualFilterNew reflection={reflection} onApply={handleApplyRitual} />
        </div>
      </div>
    </div>
  )
}

