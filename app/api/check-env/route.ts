import { NextResponse } from "next/server"

export async function GET() {
  const requiredEnvVars = ["OPENAI_API_KEY"]
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  return NextResponse.json({ missingEnvVars })
}

