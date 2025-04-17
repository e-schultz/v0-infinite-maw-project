import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Reflection } from "@/lib/types"
import type { RitualType } from "@/lib/rituals"

interface MawState {
  reflections: Reflection[]
  ritualProcessing: {
    isProcessing: boolean
    error: string | null
    activeReflectionId: string | null
    activeRitualType: RitualType | null
    processedOutput: string | null
  }

  // Reflection actions
  addReflection: (input: string) => string
  updateReflection: (id: string, data: Partial<Reflection>) => void
  deleteReflection: (id: string) => void

  // Ritual processing actions
  setRitualProcessing: (isProcessing: boolean) => void
  setRitualError: (error: string | null) => void
  setActiveReflection: (id: string | null, ritualType: RitualType | null) => void
  setProcessedOutput: (output: string | null) => void
  resetRitualState: () => void
}

export const useMawStore = create<MawState>()(
  persist(
    (set) => ({
      reflections: [],
      ritualProcessing: {
        isProcessing: false,
        error: null,
        activeReflectionId: null,
        activeRitualType: null,
        processedOutput: null,
      },

      // Reflection actions
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

      // Ritual processing actions
      setRitualProcessing: (isProcessing: boolean) => {
        set((state) => ({
          ritualProcessing: {
            ...state.ritualProcessing,
            isProcessing,
            error: isProcessing ? null : state.ritualProcessing.error,
          },
        }))
      },

      setRitualError: (error: string | null) => {
        set((state) => ({
          ritualProcessing: {
            ...state.ritualProcessing,
            error,
          },
        }))
      },

      setActiveReflection: (id: string | null, ritualType: RitualType | null) => {
        set((state) => ({
          ritualProcessing: {
            ...state.ritualProcessing,
            activeReflectionId: id,
            activeRitualType: ritualType,
          },
        }))
      },

      setProcessedOutput: (output: string | null) => {
        set((state) => ({
          ritualProcessing: {
            ...state.ritualProcessing,
            processedOutput: output,
          },
        }))
      },

      resetRitualState: () => {
        set((state) => ({
          ritualProcessing: {
            isProcessing: false,
            error: null,
            activeReflectionId: null,
            activeRitualType: null,
            processedOutput: null,
          },
        }))
      },
    }),
    {
      name: "maw-storage",
    },
  ),
)

