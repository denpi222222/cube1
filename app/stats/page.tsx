"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Hammer, Wrench, HardHat, Construction } from "lucide-react"
import { useMetaMask } from "@/hooks/use-metamask"
import Link from "next/link"
import { ParticleEffect } from "@/components/particle-effect"
import { MetaMaskButton } from "@/components/metamask-button"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

// Import useTranslation
import { useTranslation } from "react-i18next"

// First, import the StatsAnimation component at the top of the file
import { StatsAnimation } from "@/components/stats-animation"

// Import TabNavigation:
import { TabNavigation } from "@/components/tab-navigation"

export default function StatsPage() {
  const { connected } = useMetaMask()
  const isMobile = useMobile()

  // Inside the component, add:
  const { t } = useTranslation()

  // Select a random cube for display
  const cubeImages = [
    "/images/cube1.png", // First cube
    "/images/cube2.png", // Second cube
    "/images/cube3.png", // Third cube
  ]

  const randomCubeImage = cubeImages[Math.floor(Math.random() * cubeImages.length)]

  // Replace the hardcoded phrases array with:
  // Fun phrases from the cube
  const phrases = t("construction.phrases", { returnObjects: true }) as string[]

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-indigo-900 to-violet-900 flex flex-col items-center justify-center p-4">
        <div className="mb-6 w-24 h-24 relative">
          <Image
            src="/images/logo.png"
            alt="CrazyCube Logo"
            width={96}
            height={96}
            className="object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />
        </div>
        <Card className="w-full max-w-md bg-black/30 border border-violet-500/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-violet-400">Project Statistics 📊</CardTitle>
            <CardDescription className="text-center text-violet-300">
              Connect your wallet to view statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MetaMaskButton />
          </CardContent>
          <CardContent className="flex justify-center pt-4">
            <Link href="/">
              <Button variant="outline" className="border-violet-500/30 bg-black/20 text-violet-300 hover:bg-black/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-indigo-900 to-violet-900 p-4">
      {/* Add statistics animation */}
      <StatsAnimation />

      <ParticleEffect
        count={isMobile ? 15 : 30}
        colors={["#a78bfa", "#818cf8", "#60a5fa"]}
        speed={isMobile ? 0.4 : 0.6}
        size={isMobile ? 3 : 5}
      />

      <div className="container mx-auto">
        <header className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-violet-500/30 bg-black/20 text-violet-300 hover:bg-black/40">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
            {t("sections.stats.title")}
          </h1>
          <p className="text-center text-violet-300 mt-2">{t("sections.stats.description")}</p>
        </header>

        {/* Add tab navigation */}
        <TabNavigation />

        {/* Embedded "Under Construction" placeholder */}
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <div className="relative">
            {/* Animated tools around the cube */}
            <motion.div
              className="absolute -top-8 -right-8"
              animate={{ rotate: [0, 20, 0, -20, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Hammer className="h-8 w-8 text-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -left-8"
              animate={{ rotate: [0, -20, 0, 20, 0] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Wrench className="h-8 w-8 text-blue-400" />
            </motion.div>

            {/* Cube with construction hat */}
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {/* Construction hat */}
              <motion.div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <HardHat className="h-12 w-12 text-yellow-500" />
              </motion.div>

              {/* Cube */}
              <div className="mb-6 w-32 h-32 md:w-40 md:h-40 relative animate-pulse">
                <Image src="/favicon.ico" alt="CrazyCube Logo" width={160} height={160} className="object-contain" />
              </div>
              <div className={`${isMobile ? "w-40 h-40" : "w-64 h-64"} relative`}>
                <Image
                  src={randomCubeImage || "/placeholder.svg"}
                  alt="Construction Cube"
                  width={300}
                  height={300}
                  className="object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                />
              </div>
              <Image src="/favicon.ico" alt="CrazyCube Logo" width={160} height={160} className="object-contain" />
            </motion.div>
          </div>

          {/* "Under Construction" sign */}
          <motion.div
            className="mt-8 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 max-w-md relative overflow-hidden"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            {/* Striped ribbon */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-yellow-500 rotate-45 z-0" />
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-yellow-500 rotate-45 z-0" />

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Construction className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold text-yellow-300">UNDER CONSTRUCTION</h2>
                <Construction className="h-6 w-6 text-yellow-500 ml-2" />
              </div>

              <p className="text-center text-white mb-4">
                This section is currently under development. There will be lots of interesting content here soon!
              </p>

              <motion.div
                className="bg-black/30 p-3 rounded-lg mb-4 text-center"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <p className="text-yellow-300 font-medium">"{randomPhrase}"</p>
              </motion.div>
            </div>
          </motion.div>

          <Link href="/" className="mt-8">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
