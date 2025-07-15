import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Reflection, RitualHistoryEntry } from "./types"
import { v4 as uuidv4 } from "uuid"

interface MawState {
  reflections: Reflection[]
  addReflection: (input: string) => string
  updateReflection: (id: string, data: Partial<Reflection>) => void
  deleteReflection: (id: string) => void
  addRitualHistory: (reflectionId: string, historyEntry: Omit<RitualHistoryEntry, "id">) => void
}

export const useMawStore = create<MawState>()(
  persist(
    (set) => ({
      reflections: [],

      addReflection: (input: string) => {
        const id = uuidv4()
        const tones = ["raw", "mirror", "devotional", "fractured"] as const
        const randomTone = tones[Math.floor(Math.random() * tones.length)]

        // Extract potential tags from input
        const words = input.toLowerCase().split(/\s+/)
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
          input,
          date: new Date().toISOString(),
          tone: randomTone,
          tags: potentialTags,
          ritualHistory: [],
        }

        set((state) => ({
          reflections: [newReflection, ...state.reflections],
        }))

        return id
      },

      updateReflection: (id: string, data: Partial<Reflection>) => {
        set((state) => ({
          reflections: state.reflections.map((reflection) =>
            reflection.id === id ? { ...reflection, ...data } : reflection,
          ),
        }))
      },

      deleteReflection: (id: string) => {
        set((state) => ({
          reflections: state.reflections.filter((reflection) => reflection.id !== id),
        }))
      },

      addRitualHistory: (reflectionId: string, historyEntry: Omit<RitualHistoryEntry, "id">) => {
        set((state) => {
          const reflection = state.reflections.find((r) => r.id === reflectionId)
          if (!reflection) return state

          const entry: RitualHistoryEntry = {
            ...historyEntry,
            id: uuidv4(),
          }

          return {
            reflections: state.reflections.map((r) =>
              r.id === reflectionId
                ? {
                    ...r,
                    ritualHistory: [...(r.ritualHistory || []), entry],
                  }
                : r,
            ),
          }
        })
      },
    }),
    {
      name: "maw-storage",
    },
  ),
)

