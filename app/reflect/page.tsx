"use client"

import { useState } from "react"
import { MawVisual } from "@/components/maw-visual"
import { PromptPod } from "@/components/prompt-pod"
import { RecursiveTrace } from "@/components/recursive-trace"
import { useMawStore } from "@/lib/maw-store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function ReflectPage() {
  const [activeReflectionId, setActiveReflectionId] = useState<string | null>(null)
  const reflections = useMawStore((state) => state.reflections)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/volumes" className="text-gray-400 hover:text-white flex items-center gap-2">
            <BookOpen size={16} />
            <span>Volumes</span>
          </Link>
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MawVisual size={600} />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <PromptPod onReflectionCreated={(id) => setActiveReflectionId(id)} />

          {reflections.length > 0 && (
            <div className="mt-8">
              <RecursiveTrace reflections={reflections.slice(-3)} activeId={activeReflectionId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

