"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useMawStore } from "@/lib/maw-store"
import { motion } from "framer-motion"
import { Send } from "lucide-react"

interface PromptPodProps {
  onReflectionCreated?: (id: string) => void
}

export function PromptPod({ onReflectionCreated }: PromptPodProps) {
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addReflection = useMawStore((state) => state.addReflection)

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsSubmitting(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const id = addReflection(input)
    setInput("")
    setIsSubmitting(false)

    if (onReflectionCreated) {
      onReflectionCreated(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your reflection..."
          className="min-h-[150px] text-lg font-serif bg-transparent border-none resize-none p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="p-3 flex justify-end border-t border-gray-800">
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isSubmitting}
            className="bg-purple-900 hover:bg-purple-800"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              </motion.div>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

