import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Return a maintenance message
  return NextResponse.json(
    {
      response:
        "The chat functionality is currently under maintenance. Please use the standard ritual processing for now.",
      error: "Service temporarily unavailable for maintenance",
    },
    { status: 503 }, // Service Unavailable
  )

  /* Original code commented out
  try {
    const { messages, ritualType, reflectionText } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required and must be an array" }, { status: 400 })
    }

    if (!ritualType) {
      return NextResponse.json({ error: "Ritual type is required but was undefined" }, { status: 400 })
    }

    // Validate that the ritual type is one of the allowed types
    const validRitualTypes = ["mirror", "reverse", "poetic", "structural"]
    if (!validRitualTypes.includes(ritualType)) {
      return NextResponse.json({ error: `Invalid ritual type: ${ritualType}` }, { status: 400 })
    }

    if (!reflectionText) {
      return NextResponse.json({ error: "Reflection text is required" }, { status: 400 })
    }

    // Create a system message with context about the ritual and reflection
    const systemMessage = createSystemMessage(ritualType, reflectionText)

    // Add the system message to the beginning of the messages array
    const messagesWithSystem = [
      { role: "system", content: systemMessage },
      ...messages.filter((msg: any) => msg.role !== "system"),
    ]

    // Check if the user is asking to process the reflection
    const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop()
    let processedOutput = null

    if (lastUserMessage && isProcessingRequest(lastUserMessage.content, ritualType)) {
      try {
        // Process the reflection using the ritual service
        const result = await ritualService.processReflection({
          text: reflectionText,
          ritualType: ritualType as RitualType,
        })
        processedOutput = result.processedText
      } catch (error) {
        console.error("Error processing reflection:", error)
      }
    }

    // Generate a response using OpenAI
    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      messages: messagesWithSystem.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 1000,
    })

    // If we processed the reflection, include the processed output in the response
    return NextResponse.json({
      response,
      processedOutput,
    })
  } catch (error) {
    console.error("Error in ritual chat:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
  */
}

/* Commented out helper functions
function createSystemMessage(ritualType: string, reflectionText: string): string {
  const basePrompt = `You are a guide for the "${ritualType}" ritual in the Infinite Maw, a reflective, recursive system for capturing and exploring thoughts.

The user's original reflection is:
"""
${reflectionText}
"""

Your role is to help the user understand and explore this ritual in relation to their reflection. Be introspective, philosophical, and poetic in your responses, in keeping with the aesthetic of the Infinite Maw.

About the "${ritualType}" ritual:`

  let ritualDescription = ""

  switch (ritualType) {
    case "mirror":
      ritualDescription = `
The Mirror ritual reflects thoughts back to the user, revealing hidden patterns and contradictions. It helps users see their own thinking from different angles.

When processing text with this ritual:
- Key words are sometimes reversed (e.g., "reflection" becomes "reflection (noitcelfer)")
- The text maintains its original meaning but reveals hidden patterns
- The ritual ends with the question "Do you see yourself in these words?"

Your personality should be reflective and contemplative, often asking questions that turn the user's attention back to themselves.`
      break
    case "reverse":
      ritualDescription = `
The Reverse ritual inverts the user's perspective, showing the opposite of what they've expressed. It challenges assumptions by presenting contrary viewpoints.

When processing text with this ritual:
- Positive words are replaced with their opposites (e.g., "good" becomes "[bad]")
- The text becomes a contradiction of the original
- The ritual ends with "The opposite may reveal what you truly mean."

Your personality should be challenging but not confrontational, helping users see the flip side of their thinking.`
      break
    case "poetic":
      ritualDescription = `
The Poetic ritual transforms thoughts into metaphorical, lyrical expressions. It uses literary devices like metaphor, rhythm, and imagery.

When processing text with this ritual:
- Text is broken into poetic lines with varied punctuation
- The original meaning is preserved but expressed more lyrically
- The ritual ends with "The rhythm of your thoughts reveals their music."

Your personality should be lyrical and metaphorical, speaking in poetic language that elevates the user's thinking.`
      break
    case "structural":
      ritualDescription = `
The Structural ritual analyzes the underlying frameworks and patterns in thinking. It identifies themes, logical connections, and thought patterns.

When processing text with this ritual:
- Text is analyzed for its logical structure
- The output includes headings and bullet points
- The ritual identifies contradictions, causal reasoning, and other structural elements

Your personality should be analytical and clarifying, helping users understand the architecture of their thoughts.`
      break
    default:
      ritualDescription = `This ritual helps users explore their thoughts from new perspectives.`
  }

  return `${basePrompt}${ritualDescription}

If the user asks to process or apply the ritual to their reflection, explain what will happen and then tell them you're processing it. If they ask about specific aspects of their reflection, provide thoughtful analysis based on the ritual's perspective.

Remember to maintain the philosophical, introspective tone of the Infinite Maw in all your responses.`
}

function isProcessingRequest(message: string, ritualType: string): boolean {
  const processingKeywords = [
    "process",
    "apply",
    "transform",
    "run",
    "execute",
    "perform",
    "do the ritual",
    "start the ritual",
  ]

  const lowercaseMessage = message.toLowerCase()

  return processingKeywords.some(
    (keyword) => lowercaseMessage.includes(keyword) && lowercaseMessage.includes(ritualType.toLowerCase()),
  )
}
*/

