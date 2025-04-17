"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Reflection } from "@/lib/types" // Fixed import path

interface VolumeViewerProps {
  reflections: Reflection[]
}

export function VolumeViewer({ reflections }: VolumeViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReflections = reflections.filter(
    (reflection) =>
      reflection.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reflection.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <Input
          type="text"
          placeholder="Search reflections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-800"
        />
      </div>

      {filteredReflections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No reflections found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReflections.map((reflection, index) => (
            <motion.div
              key={reflection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/volume/${reflection.id}`}>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-full hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-gray-500">{formatDate(reflection.date)}</span>
                    <Badge
                      className={`
                        ${reflection.tone === "raw" ? "bg-blue-900" : ""}
                        ${reflection.tone === "mirror" ? "bg-purple-900" : ""}
                        ${reflection.tone === "devotional" ? "bg-amber-900" : ""}
                        ${reflection.tone === "fractured" ? "bg-rose-900" : ""}
                      `}
                    >
                      {reflection.tone}
                    </Badge>
                  </div>

                  <p className="font-serif text-gray-300 line-clamp-4 mb-3">{reflection.input}</p>

                  {reflection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {reflection.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

