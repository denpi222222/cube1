"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ParticleEffect } from "@/components/particle-effect"
import { useMobile } from "@/hooks/use-mobile"
import { useTranslation } from "react-i18next"
import { TabNavigation } from "@/components/tab-navigation"
import { WalletConnect } from "@/components/web3/wallet-connect"
import { StatsGrid } from "@/components/web3/stats-grid"
import { NFTGrid } from "@/components/web3/nft-grid"
import { ActivityChart } from "@/components/web3/activity-chart"
import { DistributionChart } from "@/components/web3/distribution-chart"
import { RewardsChart } from "@/components/web3/rewards-chart"
import { useWeb3 } from "@/hooks/useWeb3"

export default function StatsPage() {
  const { isClient, isConnected } = useWeb3()
  const isMobile = useMobile()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  // Имитируем загрузку страницы
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isClient])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-indigo-900 to-violet-900 p-4">
      {/* Background particles */}
      <ParticleEffect
        count={isMobile ? 15 : 30}
        colors={["#a78bfa", "#818cf8", "#60a5fa"]}
        speed={isMobile ? 0.4 : 0.6}
        size={isMobile ? 3 : 5}
      />

      <div className="container mx-auto">
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/">
              <Button variant="outline" className="border-violet-500/30 bg-black/20 text-violet-300 hover:bg-black/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("construction.returnHome")}
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
              {t("sections.stats.title")}
            </h1>
          </div>
          <div>
            <WalletConnect />
          </div>
        </header>

        {/* Add tab navigation */}
        <TabNavigation />

        {/* Main content */}
        <div className="space-y-8 mt-8">
          {/* Stats Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <StatsGrid />
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-slate-200 mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActivityChart />
              <DistributionChart />
              <RewardsChart />
            </div>
          </motion.div>

          {/* Your NFTs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-200">Your NFTs</h2>
              <Link href="/bridge">
                <Button variant="outline" className="border-pink-500/30 bg-black/20 text-pink-300 hover:bg-black/40">
                  Bridge NFT
                </Button>
              </Link>
            </div>
            <NFTGrid maxDisplay={4} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
