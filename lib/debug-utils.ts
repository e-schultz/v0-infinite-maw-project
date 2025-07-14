/**
 * Debug utility functions for tracing and logging
 */

// Enable or disable debug mode
const DEBUG_MODE = true

/**
 * Log a debug message to the console
 */
export function debugLog(message: string, data?: any): void {
  if (!DEBUG_MODE) return

  const timestamp = new Date().toISOString()

  if (data) {
    console.log(`[DEBUG ${timestamp}] ${message}`, data)
  } else {
    console.log(`[DEBUG ${timestamp}] ${message}`)
  }
}

/**
 * Trace a function call with its arguments and return value
 */
export function traceFunction<T extends (...args: any[]) => any>(
  functionName: string,
  fn: T,
): (...args: Parameters<T>) => ReturnType<T> {
  if (!DEBUG_MODE) return fn

  return (...args: Parameters<T>): ReturnType<T> => {
    debugLog(`${functionName} called with args:`, args)

    try {
      const result = fn(...args)

      // Handle promises
      if (result instanceof Promise) {
        return result
          .then((value) => {
            debugLog(`${functionName} resolved with:`, value)
            return value
          })
          .catch((error) => {
            debugLog(`${functionName} rejected with:`, error)
            throw error
          }) as ReturnType<T>
      }

      debugLog(`${functionName} returned:`, result)
      return result
    } catch (error) {
      debugLog(`${functionName} threw error:`, error)
      throw error
    }
  }
}

/**
 * Create a proxy for an object to trace all method calls
 */
export function traceObject<T extends object>(objectName: string, obj: T): T {
  if (!DEBUG_MODE) return obj

  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)

      if (typeof value === "function") {
        return traceFunction(`${objectName}.${String(prop)}`, value.bind(target))
      }

      return value
    },
  })
}

