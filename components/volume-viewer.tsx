"use client"

import { useState } from "react"
import type { Reflection } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Pencil } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SemanticSearch } from "@/components/semantic-search"

interface VolumeViewerProps {
  reflections: Reflection[]
}

export function VolumeViewer({ reflections }: VolumeViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Reflection[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState<"keyword" | "semantic">("keyword")

  const filteredReflections =
    searchResults ||
    reflections.filter(
      (reflection) =>
        reflection.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reflection.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )

  // Helper function to check if a reflection has been manually edited
  const hasManualEdit = (reflection: Reflection): boolean => {
    return reflection.ritualHistory?.some((entry) => entry.ritualType === "manual") || false
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="keyword"
        onValueChange={(value) => {
          setSearchType(value as "keyword" | "semantic")
          setSearchResults(null)
          setSearchTerm("")
        }}
      >
        <TabsList className="grid grid-cols-2 bg-gray-900/80 border border-gray-800 rounded-md p-1 mb-4">
          <TabsTrigger
            value="keyword"
            className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
          >
            <Search className="mr-2" size={16} />
            Keyword Search
          </TabsTrigger>
          <TabsTrigger
            value="semantic"
            className="data-[state=active]:bg-purple-900 data-[state=active]:text-white transition-all duration-300"
          >
            <Sparkles className="mr-2" size={16} />
            Semantic Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keyword">
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
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticSearch onResults={setSearchResults} onSearching={setIsSearching} />
        </TabsContent>
      </Tabs>

      {filteredReflections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {isSearching
              ? "Searching..."
              : searchType === "semantic" && searchResults !== null
                ? "No matching reflections found."
                : "No reflections found."}
          </p>
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
                    <div className="flex gap-1">
                      {hasManualEdit(reflection) && (
                        <Badge
                          variant="outline"
                          className="bg-rose-900/30 border-rose-800 text-rose-300 flex items-center gap-1"
                        >
                          <Pencil size={10} />
                          <span>Edited</span>
                        </Badge>
                      )}
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

