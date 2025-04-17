import type { RitualDefinition } from "../types"

const mirrorRitual: RitualDefinition = {
  id: "mirror",
  name: "Mirror",
  description: "Reflects your thoughts back to you, revealing hidden patterns and contradictions.",
  icon: "🪞",

  async process(text: string, options?: Record<string, any>): Promise<string> {
    if (!text || typeof text !== "string") {
      return "No text provided for processing."
    }

    try {
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
    } catch (error) {
      console.error("Error in mirror ritual processing:", error)
      return "Failed to process text with mirror ritual."
    }
  },
}

export default mirrorRitual

