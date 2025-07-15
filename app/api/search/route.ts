import { NextResponse } from "next/server"
import { searchReflections } from "@/lib/embeddings"
import { useMawStore } from "@/lib/maw-store"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // In a real application, you would fetch reflections from a database
    // For this example, we'll use the store directly (this is a server component)
    // Note: In production, you'd need a different approach as this won't work in a route handler
    // This is just for demonstration purposes
    const store = useMawStore.getState()
    const reflections = store.reflections

    const results = await searchReflections(query, reflections, 5)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error in search endpoint:", error)
    return NextResponse.json({ error: "Failed to search reflections" }, { status: 500 })
  }
}

