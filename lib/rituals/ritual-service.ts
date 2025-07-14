import type { RitualProcessRequest, RitualProcessResponse, RitualServiceConfig, RitualType } from "./types"
import { ritualRegistry } from "./registry"

// Default configuration
const defaultConfig: RitualServiceConfig = {
  useMockImplementation: true, // Default to mock implementation
  mockDelay: 1500, // Simulate API delay
  apiEndpoint: "/api/rituals/process",
}

// Valid ritual types for validation
const VALID_RITUAL_TYPES: RitualType[] = ["mirror", "reverse", "poetic", "structural"]

class RitualService {
  private config: RitualServiceConfig

  constructor(config: Partial<RitualServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Process a reflection using the specified ritual
   */
  async processReflection(request: RitualProcessRequest): Promise<RitualProcessResponse> {
    console.log("processReflection called with request:", request)

    // Handle if request is accidentally passed as an array
    if (Array.isArray(request)) {
      console.warn("Request was passed as an array, extracting first item")
      request = request[0]

      if (!request) {
        throw new Error("Invalid request: Empty array provided")
      }
    }

    // Ensure request is an object
    if (!request || typeof request !== "object") {
      throw new Error("Invalid request: Request must be an object")
    }

    // Destructure with default values to prevent undefined
    const { text = "", ritualType = null } = request

    // Validate text
    if (!text) {
      throw new Error("Text is required for ritual processing")
    }

    // Validate ritual type more strictly
    if (!ritualType) {
      throw new Error("Ritual type is required but was undefined or empty")
    }

    // Check if ritual type is valid
    if (!VALID_RITUAL_TYPES.includes(ritualType)) {
      throw new Error(`Invalid ritual type: ${ritualType}. Must be one of: ${VALID_RITUAL_TYPES.join(", ")}`)
    }

    // Check if ritual exists in registry
    if (!ritualRegistry[ritualType]) {
      throw new Error(`Ritual type not found in registry: ${ritualType}`)
    }

    console.log(`Processing reflection with ritual type: ${ritualType}`)

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
    console.log("processMock called with request:", request)

    // Handle if request is accidentally passed as an array
    if (Array.isArray(request)) {
      console.warn("Request was passed as an array in processMock, extracting first item")
      request = request[0]

      if (!request) {
        throw new Error("Invalid request: Empty array provided")
      }
    }

    // Destructure with default values to prevent undefined
    const { text = "", ritualType = null } = request
    const startTime = Date.now()

    // Double-check ritual type again for safety
    if (!ritualType) {
      throw new Error("Ritual type is required but was undefined or empty")
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, this.config.mockDelay))

    try {
      // Get the ritual processor from the registry
      const ritual = ritualRegistry[ritualType]
      if (!ritual) {
        throw new Error(`Ritual type not found in registry: ${ritualType}`)
      }

      console.log(`Processing text with ritual: ${ritualType}`)

      // Process the text using the ritual's implementation
      const processedText = await ritual.process(text)

      const result = {
        processedText,
        metadata: {
          processingTime: Date.now() - startTime,
          ritualType,
          timestamp: new Date().toISOString(),
        },
      }

      console.log("processMock returning result:", result)

      return result
    } catch (error) {
      console.log(`Error in mock ritual processing:`, error)
      throw new Error(`Failed to process reflection with ritual: ${ritualType}`)
    }
  }

  /**
   * Real API implementation for future use
   */
  private async processApi(request: RitualProcessRequest): Promise<RitualProcessResponse> {
    console.log("processApi called with request:", request)

    // Handle if request is accidentally passed as an array
    if (Array.isArray(request)) {
      console.warn("Request was passed as an array in processApi, extracting first item")
      request = request[0]

      if (!request) {
        throw new Error("Invalid request: Empty array provided")
      }
    }

    // Destructure with default values to prevent undefined
    const { text = "", ritualType = null } = request

    // Double-check ritual type again for safety
    if (!ritualType) {
      throw new Error("Ritual type is required but was undefined or empty")
    }

    try {
      if (!this.config.apiEndpoint) {
        throw new Error("API endpoint not configured")
      }

      console.log(`Sending API request to ${this.config.apiEndpoint} with ritual type: ${ritualType}`)

      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          text,
          ritualType, // Explicitly include ritual type
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`API error: ${response.status} ${errorData?.error || response.statusText}`)
      }

      const result = await response.json()
      console.log("processApi returning result:", result)

      return result
    } catch (error) {
      console.log("Error calling ritual API:", error)
      throw new Error("Failed to process reflection. Please try again later.")
    }
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<RitualServiceConfig>) {
    this.config = { ...this.config, ...config }
    console.log("Ritual service config updated:", this.config)
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

