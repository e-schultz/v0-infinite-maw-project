"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"

interface LogEntry {
  timestamp: string
  message: string
  type: "info" | "error" | "warning"
}

export function DebugLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isVisible, setIsVisible] = useState(false)

  // Capture console logs
  useEffect(() => {
    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.log = (...args) => {
      originalConsoleLog(...args)
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
          type: "info",
        },
      ])
    }

    console.error = (...args) => {
      originalConsoleError(...args)
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
          type: "error",
        },
      ])
    }

    console.warn = (...args) => {
      originalConsoleWarn(...args)
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
          type: "warning",
        },
      ])
    }

    return () => {
      console.log = originalConsoleLog
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }, [])

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-gray-900 border-gray-700"
        onClick={() => setIsVisible(true)}
      >
        <Bug size={16} className="mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:w-1/2 lg:w-1/3 h-1/3 bg-gray-900 border-t border-l border-gray-700 overflow-auto">
      <div className="flex justify-between items-center p-2 border-b border-gray-700 bg-gray-800">
        <h3 className="text-sm font-bold">Debug Logs</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Close
        </Button>
      </div>

      <div className="p-2 space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No logs yet</p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`text-xs font-mono p-1 rounded ${
                log.type === "error"
                  ? "bg-red-900/30 text-red-300"
                  : log.type === "warning"
                    ? "bg-amber-900/30 text-amber-300"
                    : "bg-gray-800/50 text-gray-300"
              }`}
            >
              <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>{" "}
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

