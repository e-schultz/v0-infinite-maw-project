import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Valid ritual types for validation
const VALID_RITUAL_TYPES = ["mirror", "reverse", "poetic", "structural"]

export async function POST(request: Request) {
  try {
    const { text, filter } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Validate filter/ritual type
    if (!filter) {
      return NextResponse.json({ error: "Filter/ritual type is required but was undefined or empty" }, { status: 400 })
    }

    // Check if filter is valid
    if (!VALID_RITUAL_TYPES.includes(filter)) {
      return NextResponse.json(
        {
          error: `Invalid filter/ritual type: ${filter}. Must be one of: ${VALID_RITUAL_TYPES.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Log for debugging
    console.log(`Processing reflection with filter/ritual type: ${filter}`)

    let prompt = ""

    switch (filter) {
      case "mirror":
        prompt = `
          Transform the following text to reflect back to the writer, revealing hidden patterns and contradictions.
          Make the response introspective and thoughtful, as if the text is a mirror showing the writer their own thoughts.
          
          Original text: "${text}"
          
          Transformed reflection:
        `
        break
      case "reverse":
        prompt = `
          Transform the following text by inverting its perspective and showing the opposite of what was expressed.
          Challenge the writer's assumptions by presenting contrary viewpoints.
          
          Original text: "${text}"
          
          Reversed perspective:
        `
        break
      case "poetic":
        prompt = `
          Transform the following text into a poetic, metaphorical expression.
          Use literary devices like metaphor, rhythm, and imagery to create a lyrical version of the original thoughts.
          
          Original text: "${text}"
          
          Poetic transformation:
        `
        break
      case "structural":
        prompt = `
          Analyze the structure of the following text, revealing its underlying frameworks and patterns.
          Present the analysis in a structured format with headings and bullet points.
          Identify themes, logical connections, and thought patterns.
          
          Original text: "${text}"
          
          Structural analysis:
        `
        break
      default:
        // This should never happen due to validation above, but just in case
        return NextResponse.json({ error: `Unsupported filter type: ${filter}` }, { status: 400 })
    }

    const { text: processedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return NextResponse.json({ processedText })
  } catch (error) {
    console.error("Error processing reflection:", error)
    return NextResponse.json({ error: "Failed to process reflection" }, { status: 500 })
  }
}

