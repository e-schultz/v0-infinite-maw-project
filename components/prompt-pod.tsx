"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useMawStore } from "@/lib/store"
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

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const id = addReflection(input)
      setInput("")

      if (onReflectionCreated) {
        onReflectionCreated(id)
      }
    } catch (error) {
      console.error("Error creating reflection:", error)
      // Could add error handling UI here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-800 overflow-hidden shadow-xl transition-all duration-300 hover:border-gray-700 hover:shadow-purple-900/20">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your reflection..."
          className="min-h-[150px] text-lg font-serif bg-gray-900/95 text-white border-none resize-none p-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
        />

        <div className="p-3 flex justify-end border-t border-gray-800">
          <Button onClick={handleSubmit} disabled={!input.trim() || isSubmitting} className="maw-button-primary">
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

