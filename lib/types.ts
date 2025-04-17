// Core application types
export type RitualType = "mirror" | "reverse" | "poetic" | "structural"

export interface Reflection {
  id: string
  input: string
  date: string
  tone: "raw" | "mirror" | "devotional" | "fractured"
  tags: string[]
  processedOutput?: string
}

export interface RitualDefinition {
  id: RitualType
  name: string
  description: string
  icon: string
}

