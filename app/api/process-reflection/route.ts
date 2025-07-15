import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { text, filter, systemInstructions } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    let prompt = ""

    // Use custom instructions if provided, otherwise use defaults
    if (systemInstructions) {
      // Replace [TEXT] placeholder with the actual text
      prompt = systemInstructions.replace("[TEXT]", text)
    } else {
      switch (filter) {
        case "mirrorTrace":
          prompt = `
            Reflective recursion: reveals unconscious thought forms, echoes, and dissonance.
            Transform the following text to reflect back to the writer, revealing hidden patterns, unconscious thought forms, and dissonance.
            Make the response introspective and thoughtful, as if the text is a mirror showing the writer their own thoughts.
            
            Original text: "${text}"
            
            Transformed reflection:
          `
          break
        case "rufoTest":
          prompt = `
            Persona reversal: reveals bias, blind spots, and ideological inversion (System 2 test).
            Transform the following text by inverting its perspective and showing the opposite of what was expressed.
            Challenge the writer's assumptions by presenting contrary viewpoints, revealing biases and blind spots.
            This is a System 2 test that helps identify ideological inversions.
            
            Original text: "${text}"
            
            Reversed perspective:
          `
          break
        case "oracleVoice":
          prompt = `
            Lyrical invocation: renders text as dream-logic, archetype, or poetic code.
            Transform the following text into a poetic, metaphorical expression using dream-logic and archetypal imagery.
            Use literary devices like metaphor, rhythm, and imagery to create a lyrical version of the original thoughts.
            The result should feel like poetic code or an oracle's pronouncement.
            
            Original text: "${text}"
            
            Oracle voice transformation:
          `
          break
        case "sigilMap":
          prompt = `
            Structural trace: renders architecture of thought in patterns, themes, and logic flows.
            Analyze the structure of the following text, revealing its underlying frameworks, patterns, themes, and logic flows.
            Present the analysis in a structured format with headings and bullet points.
            Identify themes, logical connections, and thought patterns to create a map of the thought architecture.
            
            Original text: "${text}"
            
            Sigil map analysis:
          `
          break
        default:
          // Default fallback: echoCheck
          prompt = `
            Default fallback: basic reflection scaffold.
            Provide a simple reflection on the following text, offering a basic scaffold for further thought.
            
            Original text: "${text}"
            
            Echo check reflection:
          `
      }
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

