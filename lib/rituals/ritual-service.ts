import type { RitualProcessRequest, RitualProcessResponse, RitualServiceConfig } from "./types"
import { ritualRegistry } from "./registry"

// Default configuration
const defaultConfig: RitualServiceConfig = {
  useMockImplementation: true, // Default to mock implementation
  mockDelay: 1500, // Simulate API delay
  apiEndpoint: "/api/rituals/process",
}

class RitualService {
  private config: RitualServiceConfig

  constructor(config: Partial<RitualServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Process a reflection using the specified ritual
   */
  async processReflection(request: RitualProcessRequest): Promise<RitualProcessResponse> {
    const { text, ritualType, options } = request

    if (!text) {
      throw new Error("Text is required for ritual processing")
    }

    if (!ritualType || !ritualRegistry[ritualType]) {
      throw new Error(`Invalid ritual type: ${ritualType}`)
    }

    // Use mock implementation if configured
    if (this.config.useMockImplementation) {
      return this.processMock(request)
    }

    // Otherwise, make a real API call
    return this.processApi(request)
  }

  /**
   * Mock implementation that simulates API behavior
   */
  private async processMock(request: RitualProcessRequest): Promise<RitualProcessResponse> {
    const { text, ritualType, options } = request
    const startTime = Date.now()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, this.config.mockDelay))

    try {
      // Get the ritual processor from the registry
      const ritual = ritualRegistry[ritualType]
      if (!ritual) {
        throw new Error(`Ritual type not found: ${ritualType}`)
      }

      // Process the text using the ritual's implementation
      const processedText = await ritual.process(text, options)

      return {
        processedText,
        metadata: {
          processingTime: Date.now() - startTime,
          ritualType,
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error(`Error in mock ritual processing:`, error)
      throw new Error(`Failed to process reflection with ritual: ${ritualType}`)
    }
  }

  /**
   * Real API implementation for future use
   */
  private async processApi(request: RitualProcessRequest): Promise<RitualProcessResponse> {
    const { text, ritualType, options } = request

    try {
      if (!this.config.apiEndpoint) {
        throw new Error("API endpoint not configured")
      }

      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          text,
          ritualType,
          options,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`API error: ${response.status} ${errorData?.error || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error calling ritual API:", error)
      throw new Error("Failed to process reflection. Please try again later.")
    }
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<RitualServiceConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get available ritual types
   */
  getAvailableRituals() {
    return Object.values(ritualRegistry)
  }
}

// Export a singleton instance
export const ritualService = new RitualService()

// Also export the class for testing or custom instances
export default RitualService

