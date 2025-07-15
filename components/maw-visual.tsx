"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface MawVisualProps {
  size?: number
}

export function MawVisual({ size = 400 }: MawVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const renderFrame = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Center of the canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw recursive circles
      const maxLayers = 12
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.4

      for (let i = 0; i < maxLayers; i++) {
        const progress = i / maxLayers
        const radius = baseRadius * (1 - progress)

        // Calculate pulsing effect
        const pulseSpeed = 0.0005
        const pulseAmount = 0.05
        const pulse = 1 + Math.sin(time * pulseSpeed * (i + 1)) * pulseAmount

        // Calculate rotation
        const rotationSpeed = 0.0001
        const rotation = time * rotationSpeed * (i % 2 === 0 ? 1 : -1)

        // Colors
        const hue = (270 + i * 10) % 360 // Purple-ish base
        const saturation = 70 - progress * 30
        const lightness = 20 + progress * 20
        const alpha = 0.7 - progress * 0.5

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotation)

        // Draw main circle
        ctx.beginPath()
        ctx.arc(0, 0, radius * pulse, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
        ctx.lineWidth = 1 + (1 - progress) * 2
        ctx.stroke()

        // Draw decorative patterns
        const patternCount = 6 + (i % 4)
        for (let j = 0; j < patternCount; j++) {
          const angle = (j / patternCount) * Math.PI * 2
          const patternRadius = radius * 0.8
          const x = Math.cos(angle) * patternRadius
          const y = Math.sin(angle) * patternRadius

          ctx.beginPath()
          ctx.arc(x, y, radius * 0.1, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${(hue + 30) % 360}, ${saturation}%, ${lightness + 10}%, ${alpha * 0.8})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        ctx.restore()
      }

      time++
      animationFrameId = requestAnimationFrame(renderFrame)
    }

    renderFrame()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="relative">
      <canvas ref={canvasRef} width={size} height={size} className="opacity-80" />
    </motion.div>
  )
}

