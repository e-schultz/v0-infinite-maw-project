"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bug, X, ChevronUp, ChevronDown, Trash } from "lucide-react"

interface LogEntry {
  timestamp: string
  message: string
  type: "info" | "error" | "warning" | "debug"
  data?: any
}

export function DebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Capture console logs
  useEffect(() => {
    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn
    const originalConsoleDebug = console.debug

    console.log = (...args) => {
      originalConsoleLog(...args)
      const message = args[0]
      const data = args.length > 1 ? args.slice(1) : undefined

      if (typeof message === "string" && message.startsWith("[DEBUG")) {
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            message: message,
            data: data,
            type: "debug",
          },
        ])
      } else {
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
            type: "info",
          },
        ])
      }
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

    console.debug = (...args) => {
      originalConsoleDebug(...args)
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
          type: "debug",
        },
      ])
    }

    return () => {
      console.log = originalConsoleLog
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
      console.debug = originalConsoleDebug
    }
  }, [])

  const clearLogs = () => {
    setLogs([])
  }

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
    <div
      className={`fixed right-0 z-50 w-full md:w-1/2 lg:w-1/3 bg-gray-900 border-t border-l border-gray-700 transition-all duration-300 ${
        isExpanded ? "bottom-0 h-2/3" : "bottom-0 h-12"
      }`}
    >
      <div className="flex justify-between items-center p-2 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="mr-2">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
          <h3 className="text-sm font-bold">Debug Logs ({logs.length})</h3>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={clearLogs} className="mr-2">
            <Trash size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <X size={16} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-2 space-y-2 overflow-auto h-[calc(100%-40px)]">
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
                      : log.type === "debug"
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-gray-800/50 text-gray-300"
                }`}
              >
                <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>{" "}
                <span>{log.message}</span>
                {log.data && <pre className="mt-1 overflow-x-auto">{JSON.stringify(log.data, null, 2)}</pre>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

