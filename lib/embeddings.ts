import { openai } from "@ai-sdk/openai"
import { generateEmbedding } from "ai"
import type { Reflection } from "./types"

// Function to generate embeddings for a text
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await generateEmbedding({
      model: openai("text-embedding-3-small"),
      input: text,
    })

    return embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw error
  }
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dotProduct / (magA * magB)
}

// Search reflections by semantic similarity
export async function searchReflections(query: string, reflections: Reflection[], topK = 5): Promise<Reflection[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await getEmbedding(query)

    // For each reflection, we need to generate an embedding if it doesn't have one
    // In a production app, you'd store these embeddings in a database
    const reflectionsWithScores = await Promise.all(
      reflections.map(async (reflection) => {
        // In a real app, you'd check if the reflection already has an embedding
        // For this example, we'll generate a new one each time
        const textToEmbed = reflection.input
        const embedding = await getEmbedding(textToEmbed)

        const similarity = cosineSimilarity(queryEmbedding, embedding)

        return {
          reflection,
          score: similarity,
        }
      }),
    )

    // Sort by similarity score (highest first) and take top K
    const topResults = reflectionsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.reflection)

    return topResults
  } catch (error) {
    console.error("Error in semantic search:", error)
    throw error
  }
}

