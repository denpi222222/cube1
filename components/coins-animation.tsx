"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface CoinsAnimationProps {
  intensity?: number
  className?: string
}

export function CoinsAnimation({ intensity = 1, className = "" }: CoinsAnimationProps) {
  const [isClient, setIsClient] = useState(false)
  const [coins, setCoins] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; rotation: number }>
  >([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Optimize coin generation with useCallback
  const generateCoins = useCallback((intensity: number, isMobile: boolean) => {
    // Reduce coin count for better performance
    const coinCount = Math.floor(30 * intensity)
    return Array.from({ length: coinCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // X position (percentage)
      y: Math.random() * 100, // Initial Y position
      size: Math.random() * 20 + (isMobile ? 15 : 20), // Smaller coins on mobile
      delay: Math.random() * 5, // Random delay up to 5 seconds
      duration: 3 + Math.random() * 3, // Duration 3-6 seconds (reduced)
      rotation: Math.random() * 360, // Initial rotation angle
    }))
  }, [])

  useEffect(() => {
    if (!isClient) return

    const isMobile = window.innerWidth < 768
    const newCoins = generateCoins(intensity, isMobile)
    setCoins(newCoins)

    // Add resize handler to adjust coin count on window resize
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setCoins(generateCoins(intensity, isMobile))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isClient, intensity, generateCoins])

  if (!isClient) return null

  // Determine if we're on mobile for responsive adjustments
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      {/* Background glow - simplified */}
      <div className="absolute inset-0 bg-yellow-500/20 blur-3xl"></div>

      {/* Falling coins - reduced quantity */}
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute"
          style={{
            left: `${coin.x}%`,
            top: `-${coin.size}px`,
            width: coin.size,
            height: coin.size,
          }}
          initial={{
            y: -100,
            x: 0,
            opacity: 0,
            rotate: coin.rotation,
          }}
          animate={{
            y: [`${-coin.size}px`, `${window.innerHeight + coin.size}px`],
            x: [0, (Math.random() - 0.5) * 150], // Reduced movement range
            opacity: [0, 0.9, 0],
            rotate: [coin.rotation, coin.rotation + 360 * (Math.random() > 0.5 ? 1 : -1)],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 3,
            ease: "easeIn",
          }}
        >
          {/* Gold coin - simplified rendering */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg"></div>
            <div className="absolute inset-[2px] rounded-full bg-gradient-radial from-yellow-200 via-yellow-300 to-yellow-500 border-2 border-yellow-600/50"></div>
            <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-white/70 rounded-full blur-[1px]"></div>
          </div>
        </motion.div>
      ))}

      {/* Upward flying coins - reduced quantity */}
      {Array.from({ length: Math.floor(10 * intensity) }).map((_, i) => (
        <motion.div
          key={`up-coin-${i}`}
          className="absolute"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: `-50px`,
            width: 20 + Math.random() * 15,
            height: 20 + Math.random() * 15,
          }}
          initial={{
            y: 0,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: [0, -200 - Math.random() * 100], // Reduced height
            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100], // Reduced movement
            opacity: [0, 1, 0],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 2 + Math.random() * 2, // Reduced duration
            delay: Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5,
            ease: "easeOut",
          }}
        >
          {/* Gold coin - simplified */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg"></div>
            <div className="absolute inset-[2px] rounded-full bg-gradient-radial from-yellow-200 via-yellow-300 to-yellow-500 border-2 border-yellow-600/50"></div>
            <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-white/70 rounded-full blur-[1px]"></div>
          </div>
        </motion.div>
      ))}

      {/* Gold pile at bottom - simplified */}
      {!isMobile && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
          <div className="relative h-40">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-20 bg-gradient-to-t from-yellow-700 via-yellow-600 to-yellow-500 rounded-[50%] shadow-lg"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] h-16 bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 rounded-[50%] shadow-lg"></div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[80%] h-12 bg-gradient-to-t from-yellow-500 via-yellow-400 to-yellow-300 rounded-[50%] shadow-lg"></div>
          </div>
        </div>
      )}
    </div>
  )
}
