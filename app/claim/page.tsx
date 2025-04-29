"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Hammer, Wrench, HardHat, Construction, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { MetaMaskButton } from "@/components/metamask-button"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { CoinsAnimation } from "@/components/coins-animation"
import { TabNavigation } from "@/components/tab-navigation"
import { useWalletStore } from "@/store/useWalletStore"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

export default function ClaimPage() {
  const { connected, account, balance } = useWalletStore()
  const isMobile = useMobile()
  const { toast } = useToast()
  const { t } = useTranslation()

  // State for wallet validation
  const [isValidating, setIsValidating] = useState(false)
  const [isValidWallet, setIsValidWallet] = useState(true)
  const [hasClaimableRewards, setHasClaimableRewards] = useState(false)

  // Validate wallet when connected
  useEffect(() => {
    if (connected && account) {
      const validateWallet = async () => {
        setIsValidating(true)
        try {
          // Simulate API call to validate wallet
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // For demo purposes, we'll assume the wallet is valid if the address starts with "0x"
          const isValid = account.startsWith("0x")
          setIsValidWallet(isValid)

          // Check if wallet has claimable rewards
          // This would be an actual API call in production
          const hasRewards = Number.parseFloat(balance) > 0
          setHasClaimableRewards(hasRewards)

          if (!isValid) {
            toast({
              title: "Invalid Wallet",
              description: "Your wallet is not eligible for claiming rewards",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error validating wallet:", error)
          setIsValidWallet(false)
          toast({
            title: "Validation Error",
            description: "Failed to validate your wallet. Please try again later.",
            variant: "destructive",
          })
        } finally {
          setIsValidating(false)
        }
      }

      validateWallet()
    }
  }, [connected, account, balance, toast])

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
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-yellow-900 flex flex-col items-center justify-center p-4">
        <div className="mb-6 w-24 h-24 relative">
          {/* Gold coin instead of logo */}
          <div className="w-24 h-24 rounded-full bg-gradient-radial from-yellow-300 via-yellow-500 to-yellow-700 shadow-lg"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-300/0 via-yellow-500/30 to-yellow-700/50 blur-md"></div>
        </div>
        <Card className="w-full max-w-md bg-black/30 border border-yellow-500/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-400">{t("sections.claim.title")}</CardTitle>
            <CardDescription className="text-center text-yellow-300">{t("sections.claim.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MetaMaskButton />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="outline" className="border-yellow-500/30 bg-black/20 text-yellow-300 hover:bg-black/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("construction.returnHome")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-yellow-900 p-4">
      {/* Use only our new coin animation with high intensity */}
      <CoinsAnimation intensity={isMobile ? 1.5 : 2.5} />

      <div className="container mx-auto">
        <header className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-yellow-500/30 bg-black/20 text-yellow-300 hover:bg-black/40">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("construction.returnHome")}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
            {t("sections.claim.title")}
          </h1>
          <p className="text-center text-yellow-300 mt-2">{t("sections.claim.description")}</p>
        </header>

        {/* Add tab navigation */}
        <TabNavigation />

        {/* Wallet validation status */}
        {isValidating ? (
          <div className="flex justify-center my-4">
            <div className="bg-black/30 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-yellow-500 mr-3"></div>
              <span className="text-yellow-300">{t("wallet.validating")}</span>
            </div>
          </div>
        ) : !isValidWallet ? (
          <div className="flex justify-center my-4">
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-300">{t("wallet.invalid")}</span>
            </div>
          </div>
        ) : hasClaimableRewards ? (
          <div className="flex justify-center my-4">
            <div className="bg-black/30 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 flex items-center">
              <div className="h-5 w-5 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-300">{t("wallet.claimable")}</span>
            </div>
          </div>
        ) : null}

        {/* Embedded "Under Construction" placeholder */}
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
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
                  loading="eager"
                  priority={true}
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
                <h2 className="text-2xl font-bold text-yellow-300">{t("construction.title")}</h2>
                <Construction className="h-6 w-6 text-yellow-500 ml-2" />
              </div>

              <p className="text-center text-white mb-4">{t("construction.message")}</p>

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
            <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500">
              {t("construction.returnHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
