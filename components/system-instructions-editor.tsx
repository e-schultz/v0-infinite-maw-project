"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

interface SystemInstructionsEditorProps {
  ritualType: string
  onSave?: (instructions: string) => void
}

export function SystemInstructionsEditor({ ritualType, onSave }: SystemInstructionsEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [instructions, setInstructions] = useState(() => getDefaultInstructions(ritualType))

  function getDefaultInstructions(type: string): string {
    switch (type) {
      case "mirrorTrace":
        return `Reflective recursion: reveals unconscious thought forms, echoes, and dissonance.
Transform the following text to reflect back to the writer, revealing hidden patterns, unconscious thought forms, and dissonance.
Make the response introspective and thoughtful, as if the text is a mirror showing the writer their own thoughts.

Original text: "[TEXT]"

Transformed reflection:`
      case "rufoTest":
        return `Persona reversal: reveals bias, blind spots, and ideological inversion (System 2 test).
Transform the following text by inverting its perspective and showing the opposite of what was expressed.
Challenge the writer's assumptions by presenting contrary viewpoints, revealing biases and blind spots.
This is a System 2 test that helps identify ideological inversions.

Original text: "[TEXT]"

Reversed perspective:`
      case "oracleVoice":
        return `Lyrical invocation: renders text as dream-logic, archetype, or poetic code.
Transform the following text into a poetic, metaphorical expression using dream-logic and archetypal imagery.
Use literary devices like metaphor, rhythm, and imagery to create a lyrical version of the original thoughts.
The result should feel like poetic code or an oracle's pronouncement.

Original text: "[TEXT]"

Oracle voice transformation:`
      case "sigilMap":
        return `Structural trace: renders architecture of thought in patterns, themes, and logic flows.
Analyze the structure of the following text, revealing its underlying frameworks, patterns, themes, and logic flows.
Present the analysis in a structured format with headings and bullet points.
Identify themes, logical connections, and thought patterns to create a map of the thought architecture.

Original text: "[TEXT]"

Sigil map analysis:`
      default:
        return `Default fallback: basic reflection scaffold.
Provide a simple reflection on the following text, offering a basic scaffold for further thought.

Original text: "[TEXT]"

Echo check reflection:`
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(instructions)
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[200px] font-mono text-sm bg-gray-900 border-gray-700"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-purple-900 hover:bg-purple-800">
              Save Instructions
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInstructions(getDefaultInstructions(ritualType))
                setIsEditing(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <pre className="p-4 rounded-md bg-gray-900/50 border border-gray-800 font-mono text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-[300px]">
            {instructions}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-gray-800/80 hover:bg-gray-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Instructions
          </Button>
        </motion.div>
      )}
    </div>
  )
}

