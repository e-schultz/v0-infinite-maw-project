export interface Reflection {
  id: string
  input: string
  date: string
  tone: "raw" | "mirror" | "devotional" | "fractured"
  tags: string[]
  processedOutput?: string
  ritualHistory: RitualHistoryEntry[]
}

export interface RitualHistoryEntry {
  id: string
  timestamp: string
  ritualType:
    | "mirrorTrace"
    | "rufoTest"
    | "oracleVoice"
    | "sigilMap"
    | "echoCheck"
    | "manual"
    | "mirror"
    | "reverse"
    | "poetic"
    | "structural"
  beforeText: string
  afterText: string
  isManualEdit?: boolean
}

