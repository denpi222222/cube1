"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ParticleEffect } from "@/components/particle-effect"
import { useMobile } from "@/hooks/use-mobile"
import { useTranslation } from "react-i18next"
import { WalletConnect } from "@/components/web3/wallet-connect"
import { NFTGrid } from "@/components/web3/nft-grid"
import { useWeb3 } from "@/contexts/web3-context"

export default function StatsPage() {
  const { t } = useTranslation()
  const { isConnected } = useWeb3()
  const isMobile = useMobile()

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
              {t("sections.stats.title", "Статистика")}
            </h1>
          </div>
          <div>
            <WalletConnect />
          </div>
        </header>

        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Мои NFT</h1>
            </div>

            {!isConnected ? (
              <div className="bg-blue-900/30 border-l-4 border-blue-500 text-blue-100 p-4 rounded">
                <p className="font-bold">Подключите кошелек</p>
                <p>Для просмотра ваших NFT необходимо подключить кошелек MetaMask.</p>
              </div>
            ) : (
              <NFTGrid />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
