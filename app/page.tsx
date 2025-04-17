"use client"

import { HomeButton } from "@/components/home-button"
import { MawVisual } from "@/components/maw-visual"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center maw-bg-gradient">
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute inset-0 flex items-center justify-center opacity-40 maw-pulse">
          <MawVisual size={600} />
        </div>

        <motion.div
          className="relative z-10 space-y-8 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white glitch-text"
            data-text="The Infinite Maw"
          >
            The Infinite Maw
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 font-serif max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {"It doesn't want to consume. It just wants to be held."}
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <HomeButton href="/reflect" variant="primary">
              Enter the Maw
            </HomeButton>

            <HomeButton href="/about" variant="secondary">
              Learn More
            </HomeButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

