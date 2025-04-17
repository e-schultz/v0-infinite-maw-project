import type { RitualDefinition, RitualType } from "./types"
import mirrorRitual from "./rituals/mirror"
import reverseRitual from "./rituals/reverse"
import poeticRitual from "./rituals/poetic"
import structuralRitual from "./rituals/structural"

// Registry of all available rituals
export const ritualRegistry: Record<RitualType, RitualDefinition> = {
  mirror: mirrorRitual,
  reverse: reverseRitual,
  poetic: poeticRitual,
  structural: structuralRitual,
}

// Helper function to get a ritual by ID
export function getRitual(id: RitualType): RitualDefinition | undefined {
  return ritualRegistry[id]
}

// Helper function to get all rituals as an array
export function getAllRituals(): RitualDefinition[] {
  return Object.values(ritualRegistry)
}

