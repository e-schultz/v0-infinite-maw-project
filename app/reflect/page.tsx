"use client"

import { useState } from "react"
import { MawVisual } from "@/components/maw-visual"
import { PromptPod } from "@/components/prompt-pod"
import { RecursiveTrace } from "@/components/recursive-trace"
import { useMawStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export default function ReflectPage() {
  const [activeReflectionId, setActiveReflectionId] = useState<string | null>(null)
  const reflections = useMawStore((state) => state.reflections)

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
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Home</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <Link href="/volumes" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Volumes</span>
            </Link>
          </Button>
        </motion.header>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <PromptPod onReflectionCreated={(id) => setActiveReflectionId(id)} />

            {reflections.length > 0 && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <RecursiveTrace reflections={reflections.slice(-3)} activeId={activeReflectionId} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

