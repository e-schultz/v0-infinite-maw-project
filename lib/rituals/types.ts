// Define core types for ritual processing

export type RitualType = "mirror" | "reverse" | "poetic" | "structural"

export interface RitualProcessRequest {
  text: string
  ritualType: RitualType
  options?: Record<string, any>
}

export interface RitualProcessResponse {
  processedText: string
  metadata?: {
    processingTime?: number
    ritualType: RitualType
    timestamp: string
  }
}

export interface RitualDefinition {
  id: RitualType
  name: string
  description: string
  icon: string
  process: (text: string, options?: Record<string, any>) => Promise<string>
}

export interface RitualServiceConfig {
  useMockImplementation?: boolean
  apiEndpoint?: string
  apiKey?: string
  mockDelay?: number
}

