"use client"

import { useParams } from "next/navigation"
import { useMawStore } from "@/lib/maw-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowLeftRight, Pencil } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@/components/ui/timeline"

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

export default function RitualHistoryPage() {
  const params = useParams()
  const id = params.id as string

  const { reflections } = useMawStore()
  const reflection = reflections.find((r) => r.id === id)

  if (!reflection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-400 mb-4">This reflection does not exist.</p>
        <Button asChild>
          <Link href="/volumes">Return to Volumes</Link>
        </Button>
      </div>
    )
  }

  // Sort history by timestamp, oldest first for the timeline
  const sortedHistory = [...(reflection.ritualHistory || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/volume/${id}`} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Volume</span>
          </Link>
        </Button>
      </header>

      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-serif mb-8">Ritual Evolution</h1>

        <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <h2 className="text-sm uppercase text-gray-500 mb-2">Original Reflection</h2>
          <p className="text-lg font-serif text-white whitespace-pre-wrap">{reflection.input}</p>
          <div className="mt-2 text-xs text-gray-500">{formatDate(reflection.date)}</div>
        </div>

        {sortedHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No ritual transformations have been applied yet.</p>
            <Button asChild className="mt-4">
              <Link href={`/volume/${id}`}>Apply a Ritual</Link>
            </Button>
          </div>
        ) : (
          <Timeline>
            {sortedHistory.map((entry, index) => (
              <TimelineItem key={entry.id}>
                {index < sortedHistory.length - 1 && <TimelineConnector />}
                <TimelineHeader>
                  <TimelineIcon className={getRitualColorClass(entry.ritualType)}>
                    {entry.ritualType === "manual" ? <Pencil size={14} className="text-white" /> : null}
                  </TimelineIcon>
                  <div className="flex items-center gap-2">
                    <Badge className={getRitualColorClass(entry.ritualType)}>
                      {getRitualDisplayName(entry.ritualType)}
                    </Badge>

                    {/* Add manual edit indicator */}
                    {entry.isManualEdit && entry.ritualType !== "manual" && (
                      <Badge
                        variant="outline"
                        className="bg-rose-900/30 border-rose-800 text-rose-300 text-xs px-1.5 py-0"
                      >
                        <Pencil size={10} className="mr-1" />
                        <span>M</span>
                      </Badge>
                    )}

                    <span className="text-sm text-gray-400">{formatDate(entry.timestamp)}</span>
                  </div>
                </TimelineHeader>
                <TimelineBody className="mt-2">
                  <div className="grid gap-4">
                    <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
                      <div className="text-xs uppercase text-gray-500 mb-2 flex items-center">
                        <span>Before</span>
                        {index > 0 && entry.ritualType !== "manual" && (
                          <span className="ml-2 flex items-center text-gray-600 text-[10px]">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            From previous ritual
                          </span>
                        )}
                      </div>
                      <p className="font-serif text-gray-300 whitespace-pre-wrap">{entry.beforeText}</p>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
                      <div className="text-xs uppercase text-gray-500 mb-2">After</div>
                      <p className="font-serif text-gray-300 whitespace-pre-wrap">{entry.afterText}</p>
                    </div>
                  </div>
                </TimelineBody>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </div>
    </div>
  )
}

