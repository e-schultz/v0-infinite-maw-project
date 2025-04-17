import { NextResponse } from "next/server"
import { ritualService } from "@/lib/rituals"
import type { RitualType } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, ritualType, options } = body

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!ritualType) {
      return NextResponse.json({ error: "Ritual type is required" }, { status: 400 })
    }

    // Validate ritual type
    if (!["mirror", "reverse", "poetic", "structural"].includes(ritualType)) {
      return NextResponse.json({ error: `Invalid ritual type: ${ritualType}` }, { status: 400 })
    }

    // Process the reflection using the ritual service
    const result = await ritualService.processReflection(text, ritualType as RitualType)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing ritual:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}

