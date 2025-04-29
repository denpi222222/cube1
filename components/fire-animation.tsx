"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface FireParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
  velocity: {
    x: number
    y: number
  }
  life: number
  maxLife: number
}

interface FireAnimationProps {
  intensity?: number
  className?: string
}

export function FireAnimation({ intensity = 1, className = "" }: FireAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)
  const particlesRef = useRef<FireParticle[]>([])
  const requestRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    setIsClient(true)
    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  // Optimized particle creation function
  const createFireParticle = useCallback((width: number, height: number, colors: string[]): FireParticle => {
    // Reduce size for better performance
    const size = Math.max(6, Math.random() * 20 + 10)
    const isMobile = width < 768

    // Concentrate particles in center for fire effect
    const x = width / 2 + ((Math.random() - 0.5) * width) / 3
    const baseY = height

    return {
      id: Math.random(),
      x,
      y: baseY,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        // Less horizontal spread for more vertical flame
        x: (Math.random() - 0.5) * 1.2,
        // Increase rise speed for higher flame
        y: -Math.random() * (isMobile ? 3 : 4) - (isMobile ? 2 : 3),
      },
      // Adjust lifetime for performance
      life: Math.random() * 2 + (isMobile ? 1.5 : 2),
      maxLife: isMobile ? 3.5 : 4,
    }
  }, [])

  useEffect(() => {
    if (!isClient || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Fire colors
    const fireColors = [
      "#ff0000", // red
      "#ff3300", // red-orange
      "#ff6600", // orange
      "#ff9900", // orange-yellow
      "#ffcc00", // yellow
    ]

    // Initialize particles - reduce count for better performance
    const particleCount = Math.floor(70 * intensity)
    const particles: FireParticle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push(createFireParticle(canvas.width, canvas.height, fireColors))
    }

    particlesRef.current = particles

    // Animation loop
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      // Add glow effect for fire base
      ctx.fillStyle = "rgba(255, 102, 0, 0.2)"
      const { width, height } = canvas
      ctx.fillRect(0, height - 50, width, 50)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i]

        // Update position - slower movement for better performance
        particle.x += particle.velocity.x * (deltaTime / 24)
        particle.y += particle.velocity.y * (deltaTime / 24)

        // Update life
        particle.life -= deltaTime / 1000

        // Ensure life ratio is never negative
        const lifeRatio = Math.max(0, particle.life / particle.maxLife)

        // Only draw if lifeRatio is positive
        if (lifeRatio > 0) {
          // Calculate radius - ensure it's never negative
          const radius = Math.max(0.1, particle.size * lifeRatio)

          // Draw particle
          ctx.globalAlpha = lifeRatio
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        }

        // Reset particle if it's dead
        if (particle.life <= 0) {
          particlesRef.current[i] = createFireParticle(canvas.width, canvas.height, fireColors)
        }
      }

      // Add glow effect - simplified for better performance
      ctx.globalCompositeOperation = "lighter"
      ctx.filter = "blur(4px)"

      // Draw fewer glow particles for better performance
      for (let i = 0; i < particlesRef.current.length; i += 3) {
        const particle = particlesRef.current[i]
        const lifeRatio = Math.max(0, particle.life / particle.maxLife)

        if (lifeRatio > 0) {
          const glowRadius = Math.max(0.1, particle.size * 1.5 * lifeRatio)

          ctx.globalAlpha = lifeRatio * 0.3
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        }
      }

      ctx.filter = "none"
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(requestRef.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isClient, intensity, createFireParticle])

  if (!isClient) return null

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />
    </div>
  )
}
