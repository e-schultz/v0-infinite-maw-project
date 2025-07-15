import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MawVisual } from "@/components/maw-visual"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <MawVisual size={500} />
        </div>

        <div className="relative z-10 space-y-8 py-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white glitch-text">
            The Infinite Maw
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 font-serif max-w-xl mx-auto">
            {"It doesn't want to consume. It just wants to be held."}
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" variant="default" className="bg-purple-900 hover:bg-purple-800 text-white">
              <Link href="/reflect">Enter the Maw</Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

