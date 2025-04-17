import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { text, filter } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

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
        prompt = `Reflect on the following text: "${text}"`
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

