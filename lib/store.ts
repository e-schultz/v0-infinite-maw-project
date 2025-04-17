import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Reflection } from "./types"

interface MawState {
  // Data
  reflections: Reflection[]

  // Actions
  addReflection: (text: string) => string
  updateReflection: (id: string, data: Partial<Reflection>) => void
  deleteReflection: (id: string) => void
}

export const useMawStore = create<MawState>()(
  persist(
    (set) => ({
      // Initial state
      reflections: [],

      // Actions
      addReflection: (text) => {
        const id = uuidv4()
        const tones = ["raw", "mirror", "devotional", "fractured"] as const
        const randomTone = tones[Math.floor(Math.random() * tones.length)]

        // Extract potential tags from input
        const words = text.toLowerCase().split(/\s+/)
        const commonWords = new Set([
          "the",
          "and",
          "or",
          "but",
          "in",
          "on",
          "at",
          "to",
          "a",
          "an",
          "of",
          "for",
          "with",
          "is",
          "are",
          "was",
          "were",
        ])
        const potentialTags = words
          .filter((word) => word.length > 4 && !commonWords.has(word))
          .filter((word, index, self) => self.indexOf(word) === index)
          .slice(0, 3)

        const newReflection: Reflection = {
          id,
          input: text,
          date: new Date().toISOString(),
          tone: randomTone,
          tags: potentialTags,
        }

        set((state) => ({
          reflections: [newReflection, ...state.reflections],
        }))

        return id
      },

      updateReflection: (id, data) => {
        set((state) => ({
          reflections: state.reflections.map((reflection) =>
            reflection.id === id ? { ...reflection, ...data } : reflection,
          ),
        }))
      },

      deleteReflection: (id) => {
        set((state) => ({
          reflections: state.reflections.filter((reflection) => reflection.id !== id),
        }))
      },
    }),
    {
      name: "maw-storage",
    },
  ),
)

