import type { RitualDefinition } from "../types"

const structuralRitual: RitualDefinition = {
  id: "structural",
  name: "Structural",
  description: "Analyzes the underlying structure of your thoughts, revealing frameworks.",
  icon: "🏛️",

  async process(text: string, options?: Record<string, any>): Promise<string> {
    if (!text || typeof text !== "string") {
      return "No text provided for processing."
    }

    try {
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
    } catch (error) {
      console.error("Error in structural ritual processing:", error)
      return "Failed to process text with structural ritual."
    }
  },
}

export default structuralRitual

