"use client"

import { motion } from "framer-motion"
import type { Reflection } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface RecursiveTraceProps {
  reflections: Reflection[]
  activeId: string | null
}

export function RecursiveTrace({ reflections, activeId }: RecursiveTraceProps) {
  if (reflections.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-sm uppercase text-gray-500 tracking-wider">Recent Traces</h2>

      <div className="space-y-3">
        {reflections.map((reflection, index) => (
          <motion.div
            key={reflection.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/volume/${reflection.id}`}>
              <div
                className={`
                  p-3 rounded-md border text-sm
                  ${
                    reflection.id === activeId
                      ? "bg-purple-900/30 border-purple-700"
                      : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                  }
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">{formatDate(reflection.date)}</span>
                  <span
                    className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${reflection.tone === "raw" ? "bg-blue-900/50 text-blue-300" : ""}
                      ${reflection.tone === "mirror" ? "bg-purple-900/50 text-purple-300" : ""}
                      ${reflection.tone === "devotional" ? "bg-amber-900/50 text-amber-300" : ""}
                      ${reflection.tone === "fractured" ? "bg-rose-900/50 text-rose-300" : ""}
                    `}
                  >
                    {reflection.tone}
                  </span>
                </div>
                <p className="text-gray-300 line-clamp-2 font-serif">{reflection.input}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

