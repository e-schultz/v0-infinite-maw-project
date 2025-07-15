"use client"

import { useState } from "react"
import type { RitualHistoryEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Clock, ArrowLeftRight, Pencil } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface RitualHistoryProps {
  history: RitualHistoryEntry[]
}

// Helper function to get a display name for ritual types
const getRitualDisplayName = (type: string): string => {
  switch (type) {
    case "mirrorTrace":
      return "Mirror Trace"
    case "rufoTest":
      return "Rufo Test"
    case "oracleVoice":
      return "Oracle Voice"
    case "sigilMap":
      return "Sigil Map"
    case "echoCheck":
      return "Echo Check"
    case "manual":
      return "Manual Edit"
    // Handle legacy types
    case "mirror":
      return "Mirror Trace"
    case "reverse":
      return "Rufo Test"
    case "poetic":
      return "Oracle Voice"
    case "structural":
      return "Sigil Map"
    default:
      return type
  }
}

// Helper function to get color class for ritual types
const getRitualColorClass = (type: string): string => {
  switch (type) {
    case "mirrorTrace":
    case "mirror":
      return "bg-purple-900"
    case "rufoTest":
    case "reverse":
      return "bg-blue-900"
    case "oracleVoice":
    case "poetic":
      return "bg-amber-900"
    case "sigilMap":
    case "structural":
      return "bg-emerald-900"
    case "echoCheck":
      return "bg-gray-700"
    case "manual":
      return "bg-rose-800"
    default:
      return "bg-gray-700"
  }
}

export function RitualHistory({ history }: RitualHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No ritual history yet</p>
      </div>
    )
  }

  // Sort history by timestamp, newest first
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Show only the most recent 3 entries when collapsed
  const displayedHistory = isExpanded ? sortedHistory : sortedHistory.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif">Ritual History</h3>
        {history.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show All ({history.length})
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {displayedHistory.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-6 border-l border-gray-800"
            >
              <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1.5 rounded-full bg-purple-900" />

              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                <Badge className={getRitualColorClass(entry.ritualType)}>
                  <span className="flex items-center">
                    {entry.ritualType === "manual" ? <Pencil size={12} className="mr-1" /> : null}
                    {getRitualDisplayName(entry.ritualType)}
                  </span>
                </Badge>

                {/* Add manual edit indicator */}
                {entry.isManualEdit && entry.ritualType !== "manual" && (
                  <Badge variant="outline" className="bg-rose-900/30 border-rose-800 text-rose-300 text-xs px-1.5 py-0">
                    <Pencil size={10} className="mr-1" />
                    <span>M</span>
                  </Badge>
                )}
              </div>

              <div className="grid gap-3 text-sm">
                <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
                  <div className="text-xs uppercase text-gray-500 mb-1 flex items-center">
                    <span>Before</span>
                    {index > 0 && entry.ritualType !== "manual" && (
                      <span className="ml-2 flex items-center text-gray-600 text-[10px]">
                        <ArrowLeftRight className="h-3 w-3 mr-1" />
                        From previous ritual
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-gray-300 whitespace-pre-wrap line-clamp-3">{entry.beforeText}</p>
                </div>

                <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
                  <div className="text-xs uppercase text-gray-500 mb-1">After</div>
                  <p className="font-serif text-gray-300 whitespace-pre-wrap line-clamp-3">{entry.afterText}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

