import type { RitualType, RitualDefinition } from "./types"

// Define ritual metadata for UI
export const ritualDefinitions: RitualDefinition[] = [
  {
    id: "mirror",
    name: "Mirror",
    description: "Reflects your thoughts back to you, revealing hidden patterns and contradictions.",
    icon: "🪞",
  },
  {
    id: "reverse",
    name: "Reverse",
    description: "Inverts your perspective, showing the opposite of what you've expressed.",
    icon: "↔️",
  },
  {
    id: "poetic",
    name: "Poetic",
    description: "Transforms your thoughts into metaphorical, lyrical expressions.",
    icon: "🎭",
  },
  {
    id: "structural",
    name: "Structural",
    description: "Analyzes the underlying structure of your thoughts, revealing frameworks.",
    icon: "🏛️",
  },
]

// Configuration for ritual processing
const serviceConfig = {
  useMockImplementation: true,
  mockDelay: 1500,
  apiEndpoint: "/api/rituals/process",
}

// Simple implementation of ritual processors
const mirrorProcessor = async (text: string): Promise<string> => {
  const sentences = text.split(/(?<=[.!?])\s+/)
  const processed = sentences.map((sentence) => {
    // Identify key words and reflect them
    const words = sentence.split(" ")
    const reflectedWords = words.map((word) => {
      if (word.length > 5 && Math.random() > 0.7) {
        return `${word} (${word.split("").reverse().join("")})`
      }
      return word
    })
    return reflectedWords.join(" ")
  })

  return processed.join("\n\n") + "\n\nDo you see yourself in these words?"
}

const reverseProcessor = async (text: string): Promise<string> => {
  // Replace positive words with negative and vice versa
  const opposites: Record<string, string> = {
    good: "bad",
    bad: "good",
    love: "hate",
    hate: "love",
    always: "never",
    never: "always",
    everything: "nothing",
    nothing: "everything",
    yes: "no",
    no: "yes",
  }

  let processed = text

  Object.entries(opposites).forEach(([word, opposite]) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    processed = processed.replace(regex, `[${opposite}]`)
  })

  return processed + "\n\nThe opposite may reveal what you truly mean."
}

const poeticProcessor = async (text: string): Promise<string> => {
  // Break into lines with poetic formatting
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  words.forEach((word, index) => {
    currentLine += word + " "

    if (index % 5 === 4 || index === words.length - 1) {
      lines.push(currentLine.trim())
      currentLine = ""
    }
  })

  // Add poetic elements
  const processed = lines.map((line, index) => {
    if (index % 3 === 0) {
      return line + ","
    } else if (index % 3 === 1) {
      return line + "—"
    } else {
      return line + "."
    }
  })

  return processed.join("\n") + "\n\nThe rhythm of your thoughts reveals their music."
}

const structuralProcessor = async (text: string): Promise<string> => {
  // Identify structural elements
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0)

  if (sentences.length === 0) {
    return "Not enough content to analyze structure."
  }

  const analysis = [
    "## Structural Analysis",
    "",
    `- ${sentences.length} distinct thoughts`,
    `- Primary theme: "${sentences[0]}"`,
    `- Secondary theme: "${sentences[sentences.length - 1]}"`,
    "",
    "## Logical Framework",
  ]

  sentences.forEach((sentence, index) => {
    analysis.push(`${index + 1}. ${sentence}`)

    // Add structural commentary
    if (sentence.includes("but") || sentence.includes("however")) {
      analysis.push("   ↳ Contradiction or qualification")
    } else if (sentence.includes("because") || sentence.includes("since")) {
      analysis.push("   ↳ Causal reasoning")
    } else if (sentence.includes("if") || sentence.includes("then")) {
      analysis.push("   ↳ Conditional statement")
    } else if (sentence.includes("?")) {
      analysis.push("   ↳ Inquiry or uncertainty")
    }
  })

  return analysis.join("\n")
}

// Map ritual types to their processor functions
const ritualProcessors: Record<RitualType, (text: string) => Promise<string>> = {
  mirror: mirrorProcessor,
  reverse: reverseProcessor,
  poetic: poeticProcessor,
  structural: structuralProcessor,
}

// Export the ritual service
export const ritualService = {
  // Process a reflection with a ritual
  processReflection: async (text: string, ritualType: RitualType): Promise<{ processedText: string }> => {
    if (!text) {
      throw new Error("Text is required for processing")
    }

    const processor = ritualProcessors[ritualType]
    if (!processor) {
      throw new Error(`Unknown ritual type: ${ritualType}`)
    }

    // Add artificial delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, serviceConfig.mockDelay))

    try {
      const processedText = await processor(text)
      return { processedText }
    } catch (error) {
      console.error(`Error processing with ${ritualType} ritual:`, error)
      throw new Error(`Failed to process with ${ritualType} ritual`)
    }
  },

  // Update service configuration
  updateConfig: (config: Partial<typeof serviceConfig>) => {
    Object.assign(serviceConfig, config)
  },

  // Get available rituals
  getAvailableRituals: () => {
    return ritualDefinitions
  },
}

export const getAllRituals = ritualService.getAvailableRituals
export type { RitualType, RitualDefinition }

