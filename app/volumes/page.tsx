"use client"

import { VolumeViewer } from "@/components/volume-viewer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useMawStore } from "@/lib/store"
import { MawVisual } from "@/components/maw-visual"

export default function VolumesPage() {
  const reflections = useMawStore((state) => state.reflections)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fixed background that covers the entire viewport */}
      <div className="fixed inset-0 w-full h-full bg-[#13111c] z-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <MawVisual size={900} intensity={1.2} />
        </div>
      </div>

      {/* Content with relative positioning to appear above the background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="p-4 flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Home</span>
            </Link>
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-4xl font-serif mb-8 text-center text-white">Volumes</h1>

          {reflections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-6">No reflections have been stored yet.</p>
              <Button asChild>
                <Link href="/reflect">Begin Reflecting</Link>
              </Button>
            </div>
          ) : (
            <VolumeViewer reflections={reflections} />
          )}
        </div>
      </div>
    </div>
  )
}

