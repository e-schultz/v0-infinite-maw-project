"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bug, X } from "lucide-react"

export function DebugButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  // Capture console logs when opened
  const startCapturingLogs = () => {
    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.log = (...args) => {
      originalConsoleLog(...args)
      setLogs((prev) => [
        ...prev,
        `LOG: ${args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")}`,
      ])
    }

    console.error = (...args) => {
      originalConsoleError(...args)
      setLogs((prev) => [
        ...prev,
        `ERROR: ${args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")}`,
      ])
    }

    console.warn = (...args) => {
      originalConsoleWarn(...args)
      setLogs((prev) => [
        ...prev,
        `WARN: ${args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")}`,
      ])
    }

    return () => {
      console.log = originalConsoleLog
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      startCapturingLogs()
    }
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-gray-900 border-gray-700"
        onClick={handleToggle}
      >
        <Bug size={16} className="mr-2" />
        Debug
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="font-bold">Debug Logs</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
              {logs.length === 0 ? (
                <p className="text-gray-400">No logs captured yet.</p>
              ) : (
                <pre className="text-xs font-mono whitespace-pre-wrap">{logs.join("\n")}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

