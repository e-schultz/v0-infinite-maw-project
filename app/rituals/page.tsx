"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RitualsPage() {
  const rituals = [
    {
      name: "Mirror Trace",
      codeName: "mirrorTrace",
      description: "Reflective recursion: reveals unconscious thought forms, echoes, and dissonance.",
      icon: "🪞",
    },
    {
      name: "Rufo Test",
      codeName: "rufoTest",
      description: "Persona reversal: reveals bias, blind spots, and ideological inversion (System 2 test).",
      icon: "↔️",
    },
    {
      name: "Oracle Voice",
      codeName: "oracleVoice",
      description: "Lyrical invocation: renders text as dream-logic, archetype, or poetic code.",
      icon: "🎭",
    },
    {
      name: "Sigil Map",
      codeName: "sigilMap",
      description: "Structural trace: renders architecture of thought in patterns, themes, and logic flows.",
      icon: "🏛️",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
        </Button>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif mb-4 text-center text-white">Ritual Filters</h1>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Ritual filters help you process and transform your reflections, revealing new perspectives and insights
            within your thoughts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rituals.map((ritual) => (
              <Card key={ritual.codeName} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ritual.icon}</span>
                    <CardTitle className="font-serif">{ritual.name}</CardTitle>
                  </div>
                  <CardDescription>{ritual.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/reflect">Apply to New Reflection</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

