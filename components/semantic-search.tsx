"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import type { Reflection } from "@/lib/types"

interface SemanticSearchProps {
  onResults: (results: Reflection[]) => void
  onSearching: (isSearching: boolean) => void
}

export function SemanticSearch({ onResults, onSearching }: SemanticSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)
    onSearching(true)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      onResults(data.results)
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to search reflections. Please try again.")
      onResults([])
    } finally {
      setIsSearching(false)
      onSearching(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search by meaning..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="bg-purple-900 hover:bg-purple-800"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <p className="text-gray-500 text-xs">
        Semantic search finds reflections with similar meaning, not just matching words.
      </p>
    </div>
  )
}

