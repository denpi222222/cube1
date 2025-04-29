"use client"

import { useState, useEffect, useCallback } from "react"
import { MetaMaskButton } from "@/components/metamask-button"
import { CubeAnimation } from "@/components/cube-animation"
import Link from "next/link"
import { useMetaMask } from "@/hooks/use-metamask"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Heart, Flame, Coins, BarChart3 } from "lucide-react"
import { ParticleEffect } from "@/components/particle-effect"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { SimpleLanguageSwitcher } from "@/components/simple-language-switcher"
import { useTranslation } from "react-i18next"
import { FireAnimation } from "@/components/fire-animation"
import { CoinsAnimation } from "@/components/coins-animation"
import { StatsAnimation } from "@/components/stats-animation"
import { TabNavigation } from "@/components/tab-navigation"
import dynamic from "next/dynamic"

// Dynamically import the I18nLanguageSwitcher with no SSR
const I18nLanguageSwitcher = dynamic(
  () => import("@/components/i18n-language-switcher").then((mod) => mod.I18nLanguageSwitcher),
  { ssr: false },
)

export default function HomePage() {
  // Use translation hook
  const { t } = useTranslation()

  const { connected, account } = useMetaMask()
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [i18nError, setI18nError] = useState(false)

  // States for hover effects - memoized with useMemo
  const [bridgeHovered, setBridgeHovered] = useState(false)
  const [burnHovered, setBurnHovered] = useState(false)
  const [claimHovered, setClaimHovered] = useState(false)
  const [statsHovered, setStatsHovered] = useState(false)

  const isMobile = useMobile()

  // Optimized functions with useCallback
  const handleBridgeHover = useCallback(
    (isHovered: boolean) => {
      setBridgeHovered(isMobile ? false : isHovered)
    },
    [isMobile],
  )

  const handleBurnHover = useCallback(
    (isHovered: boolean) => {
      setBurnHovered(isMobile ? false : isHovered)
    },
    [isMobile],
  )

  const handleClaimHover = useCallback(
    (isHovered: boolean) => {
      setClaimHovered(isMobile ? false : isHovered)
    },
    [isMobile],
  )

  const handleStatsHover = useCallback(
    (isHovered: boolean) => {
      setStatsHovered(isMobile ? false : isHovered)
    },
    [isMobile],
  )

  useEffect(() => {
    setIsClient(true)

    // Check if i18n is working properly
    const checkI18n = async () => {
      try {
        // Use dynamic import instead of require
        const i18nModule = await import("@/lib/i18n")
        const i18n = i18nModule.default
        if (!i18n || typeof i18n.changeLanguage !== "function") {
          setI18nError(true)
        }
      } catch (error) {
        console.error("i18n error:", error)
        setI18nError(true)
      }
    }

    checkI18n()
  }, [])

  // Simulate fetching balance when connected
  useEffect(() => {
    if (connected && account) {
      setBalance(1000)
    } else {
      setBalance(0)
    }
  }, [connected, account])

  useEffect(() => {
    // Ensure we're on client side
    if (typeof window === "undefined") return

    // Set a maximum loading time to prevent infinite loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [isClient])

  // Rendering loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="mb-6 w-32 h-32 md:w-40 md:h-40 relative animate-pulse">
          <Image src="/favicon.ico" alt="CrazyCube Logo" width={160} height={160} className="object-contain" />
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 mb-4"
        >
          {t("cubeAnimation.loading", "Loading...")}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-xl text-cyan-300"
        >
          {t("cubeAnimation.loadingMessage", "Oh no, the site is stuck! Wait, we're just lazy 🦥")}
        </motion.p>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Adding particle effect - reduced quantity */}
      <ParticleEffect
        count={isMobile ? 10 : 15}
        colors={["#22d3ee", "#0ea5e9", "#3b82f6", "#0284c7"]}
        speed={isMobile ? 0.3 : 0.5}
        size={isMobile ? 3 : 4}
      />

      {/* Noise texture for background */}
      <div className="absolute inset-0 bg-blue-noise opacity-5 mix-blend-soft-light"></div>

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-0">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="mr-3 w-16 h-16 md:w-20 md:h-20 relative"
          >
            <Image
              src="/favicon.ico"
              alt="CrazyCube Logo"
              width={80}
              height={80}
              className="object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              priority={true}
            />
          </motion.div>
          <div>
            {/* Enhanced and more noticeable title */}
            <motion.h1
              className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 relative"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                WebkitTextStroke: "2px #22d3ee",
                textShadow: "0 0 15px rgba(34, 211, 238, 0.7)",
                filter: "drop-shadow(0 0 5px #0ea5e9)",
              }}
            >
              {t("home.title", "CrazyCube")}
            </motion.h1>
            <motion.span
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              className="text-sm md:text-base text-cyan-300"
            >
              {t("home.subtitle", "Where cubes cry and joke!")}
            </motion.span>
          </div>
        </div>

        {/* Language switcher and other elements */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="w-full md:w-auto overflow-x-auto">
            {i18nError ? <SimpleLanguageSwitcher /> : <I18nLanguageSwitcher />}
          </div>
          <div className="flex justify-center md:justify-end">
            <MetaMaskButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Tab navigation */}
        <TabNavigation />

        {/* Hero section with 3D animation */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className={`${isMobile ? "h-[300px]" : "h-[400px]"} w-full relative`}>
            <CubeAnimation />
          </div>

          {connected && (
            <div className="mt-4 text-center">
              <p className="text-xl text-cyan-300">
                {t("home.balance", "Balance:")} <span className="font-bold text-2xl">{balance}</span> CRA
              </p>
            </div>
          )}
        </div>

        {/* Feature sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bridge Section - HEARTS - OPTIMIZED */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => handleBridgeHover(true)}
            onHoverEnd={() => handleBridgeHover(false)}
            className="relative overflow-hidden bg-gradient-to-br from-pink-900/90 to-rose-900/80 p-6 rounded-2xl border-2 border-pink-500/50 backdrop-blur-sm"
          >
            {/* Floating hearts - REDUCED QUANTITY */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${
                    i % 4 === 0
                      ? "text-pink-400"
                      : i % 4 === 1
                        ? "text-rose-400"
                        : i % 4 === 2
                          ? "text-red-400"
                          : "text-pink-300"
                  }`}
                  initial={{
                    x: Math.random() * 100 + 50,
                    y: Math.random() * 100 + 50,
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: 0,
                    rotate: Math.random() * 30 - 15,
                  }}
                  animate={{
                    y: [null, -100 - Math.random() * 50],
                    opacity: [0, 0.9, 0],
                    scale: [0.5, 1 + Math.random() * 0.5, 0.5],
                    rotate: [Math.random() * 30 - 15, Math.random() * 30 - 15],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                >
                  <Heart
                    size={i % 5 === 0 ? 40 : i % 5 === 1 ? 32 : i % 5 === 2 ? 24 : i % 5 === 3 ? 48 : 36}
                    fill="currentColor"
                    style={{
                      filter: "drop-shadow(0 0 8px currentColor)",
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex items-center mb-4 relative z-10">
              <Heart className="w-8 h-8 text-pink-400 mr-2" fill="currentColor" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                {t("sections.bridge.title", "Bridge (Bring Back Cube!)")}
              </h2>
            </div>
            <p className="text-pink-200 mb-6 relative z-10">
              {t(
                "sections.bridge.description",
                'Cubes return from the graveyard — a random NFT jumps out shouting "I\'m free!"',
              )}
            </p>
            <Link href="/bridge" className="relative z-10 block">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-pink-500/20 transition-all duration-200">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  {t("sections.bridge.button", "Bridge NFT")}
                </motion.span>
              </Button>
            </Link>

            {/* Pulsating glow - OPTIMIZED */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-pink-500/30 to-transparent rounded-2xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          {/* Burn Section - FIRE - OPTIMIZED */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => handleBurnHover(true)}
            onHoverEnd={() => handleBurnHover(false)}
            className="relative overflow-hidden bg-gradient-to-br from-orange-900/90 to-red-900/80 p-6 rounded-2xl border-2 border-orange-500/50 backdrop-blur-sm"
          >
            {/* Add FireAnimation component with reduced intensity */}
            <FireAnimation intensity={0.7} />

            <div className="flex items-center mb-4 relative z-10">
              <Flame className="w-8 h-8 text-orange-400 mr-2" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                {t("sections.burn.title", "Burn NFT (Roast the Cube!)")}
              </h2>
            </div>
            <p className="text-orange-200 mb-6 relative z-10">
              {t(
                "sections.burn.description",
                'Burn NFT and get CRA tokens! Epic scene of a fiery grill with NFTs flying in screaming: "Tell my mom I love her!"',
              )}
            </p>
            <Link href="/burn" className="relative z-10 block">
              <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  {t("sections.burn.button", "Burn NFT")}
                </motion.span>
              </Button>
            </Link>
          </motion.div>

          {/* Claim Section - GOLD - OPTIMIZED */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => handleClaimHover(true)}
            onHoverEnd={() => handleClaimHover(false)}
            className="relative overflow-hidden bg-gradient-to-br from-amber-900/90 to-yellow-900/80 p-6 rounded-2xl border-2 border-yellow-500/50 backdrop-blur-sm"
          >
            {/* Add CoinsAnimation component with reduced intensity */}
            <CoinsAnimation intensity={0.5} />

            <div className="flex items-center mb-4 relative z-10">
              <Coins className="w-8 h-8 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
                {t("sections.claim.title", "Claim Rewards (Where's my CRA?)")}
              </h2>
            </div>
            <p className="text-yellow-200 mb-6 relative z-10">
              {t("sections.claim.description", 'A cube with huge sad eyes shouts: "Claim me and get your CRA!"')}
            </p>
            <Link href="/claim" className="relative z-10 block">
              <Button className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-yellow-500/20 transition-all duration-200">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  {t("sections.claim.button", "Claim Reward")}
                </motion.span>
              </Button>
            </Link>
          </motion.div>

          {/* Stats Section - NEON CYBERPUNK - OPTIMIZED */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => handleStatsHover(true)}
            onHoverEnd={() => handleStatsHover(false)}
            className="relative overflow-hidden bg-gradient-to-br from-violet-900/90 to-indigo-900/80 p-6 rounded-2xl border-2 border-violet-500/50 backdrop-blur-sm"
          >
            {/* Add StatsAnimation component */}
            <StatsAnimation />

            <div className="flex items-center mb-4 relative z-10">
              <BarChart3 className="w-8 h-8 text-violet-400 mr-2" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                {t("sections.stats.title", "Statistics (Crying and Pain Counter)")}
              </h2>
            </div>
            <p className="text-violet-200 mb-6 relative z-10">
              {t(
                "sections.stats.description",
                "Shows how many NFTs were burned, returned from the graveyard, and how many CRA coins are in the pool",
              )}
            </p>
            <Link href="/stats" className="relative z-10 block">
              <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-200">
                <span>{t("sections.stats.button", "View Statistics")}</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 p-6 text-center text-cyan-300">
        <p>{t("footer.copyright", "© 2025 CrazyCube — Where cubes cry and joke!")}</p>
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="mt-2 text-sm"
        >
          {t("footer.crashMessage", "If the site crashed, the cube went out for pizza")} 🍕
        </motion.p>
      </footer>
    </div>
  )
}
