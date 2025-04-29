"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Hammer, Wrench, HardHat, Construction, Heart } from "lucide-react"
import { useMetaMask } from "@/hooks/use-metamask"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { MetaMaskButton } from "@/components/metamask-button"
import { TabNavigation } from "@/components/tab-navigation"
import { useTranslation } from "react-i18next"

export default function BridgePage() {
  const { connected } = useMetaMask()
  const isMobile = useMobile()
  const { t } = useTranslation()

  // Select a random cube for display
  const cubeImages = [
    "/images/cube1.png", // First cube
    "/images/cube2.png", // Second cube
    "/images/cube3.png", // Third cube
  ]

  const randomCubeImage = cubeImages[Math.floor(Math.random() * cubeImages.length)]

  // Fun phrases from the cube
  const phrases = t("construction.phrases", { returnObjects: true }) as string[]
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
        <div className="mb-6 w-24 h-24 relative">
          <Image
            src="/favicon.ico"
            alt="CrazyCube Logo"
            width={96}
            height={96}
            className="object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />
        </div>
        <Card className="w-full max-w-md bg-black/30 border border-pink-500/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-pink-400">
              {t("sections.bridge.title", "Bridge NFT 🔄")}
            </CardTitle>
            <CardDescription className="text-center text-pink-300">
              {t("sections.bridge.description", "Return NFT from the graveyard")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MetaMaskButton />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="outline" className="border-pink-500/30 bg-black/20 text-pink-300 hover:bg-black/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("construction.returnHome", "Return to Home")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 p-4">
      {/* Добавляем анимацию сердечек вместо частиц */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: isMobile ? 15 : 30 }).map((_, i) => (
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
              x: Math.random() * 100,
              y: Math.random() * 100,
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
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
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

      <div className="container mx-auto">
        <header className="mb-8 flex items-center">
          <Link href="/">
            <Button variant="outline" className="border-pink-500/30 bg-black/20 text-pink-300 hover:bg-black/40">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("construction.returnHome", "Return to Home")}
            </Button>
          </Link>
          <div className="ml-4 w-10 h-10 relative">
            <Image
              src="/favicon.ico"
              alt="CrazyCube Logo"
              width={40}
              height={40}
              className="object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            />
          </div>
        </header>

        {/* Add tab navigation */}
        <TabNavigation />
        <h1 className="text-3xl font-bold mt-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">
          {t("sections.bridge.title", "Bridge (Bring Back the Cube!)")} 💖
        </h1>
        <p className="text-center text-pink-300 mt-2">
          {t(
            "sections.bridge.description",
            'Cubes return from the graveyard — a random NFT jumps out shouting "I\'m free!"',
          )}
        </p>

        {/* Embedded "Under Construction" code */}
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
              <div className={`${isMobile ? "w-40 h-40" : "w-64 h-64"} relative`}>
                <Image
                  src={randomCubeImage || "/placeholder.svg"}
                  alt="Construction Cube"
                  width={300}
                  height={300}
                  className="object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                />
              </div>
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
                <h2 className="text-2xl font-bold text-yellow-300">{t("construction.title", "UNDER CONSTRUCTION")}</h2>
                <Construction className="h-6 w-6 text-yellow-500 ml-2" />
              </div>

              <p className="text-center text-white mb-4">
                {t(
                  "construction.message",
                  "This section is currently under development. There will be lots of interesting things here soon!",
                )}
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
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500">
              {t("construction.returnHome", "Return to Home")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
