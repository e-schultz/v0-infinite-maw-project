import type { RitualDefinition } from "../types"

const reverseRitual: RitualDefinition = {
  id: "reverse",
  name: "Reverse",
  description: "Inverts your perspective, showing the opposite of what you've expressed.",
  icon: "↔️",

  async process(text: string, options?: Record<string, any>): Promise<string> {
    if (!text || typeof text !== "string") {
      return "No text provided for processing."
    }

    try {
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
    } catch (error) {
      console.error("Error in reverse ritual processing:", error)
      return "Failed to process text with reverse ritual."
    }
  },
}

export default reverseRitual

