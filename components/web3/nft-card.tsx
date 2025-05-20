"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Lock } from "lucide-react"
import Image from "next/image"
import { useMobile } from "@/hooks/use-mobile"
import type { NFT } from "@/types/nft"

interface NFTCardProps {
  nft: NFT
  selectable?: boolean
  onClick?: () => void
}

export function NFTCard({ nft, selectable = false, onClick }: NFTCardProps) {
  // Rarity colors
  const rarityColors = {
    Common: "bg-slate-500",
    Uncommon: "bg-green-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-orange-500",
    Mythic: "bg-pink-500",
  }

  const isMobile = useMobile()

  return (
    <motion.div
      whileHover={selectable ? { scale: 1.02 } : {}}
      className={`relative ${selectable ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <Card className="overflow-hidden bg-black/40 border border-pink-500/30 backdrop-blur-sm">
        <div className="relative aspect-square overflow-hidden">
          {/* NFT image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <Image
                src={nft.image || "/placeholder.svg"}
                alt={`${nft.name} - ${nft.rarity} NFT`}
                width={288}
                height={288}
                className="object-contain"
              />
            </motion.div>
          </div>

          {/* Frozen overlay */}
          {nft.frozen && (
            <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center backdrop-blur-sm">
              <Lock className="h-10 w-10 text-blue-300" />
            </div>
          )}

          {/* Rarity badge */}
          <Badge className={`absolute top-3 right-3 text-sm ${rarityColors[nft.rarity]}`}>{nft.rarity}</Badge>

          {/* Reward indicator */}
          {nft.rewardBalance > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/60 rounded-full px-3 py-1.5 text-sm flex items-center">
              <Flame className="h-4 w-4 text-orange-500 mr-1.5" />
              <span className="text-orange-300">{nft.rewardBalance}</span>
            </div>
          )}
        </div>

        <CardContent className={`p-${isMobile ? "3" : "4"}`}>
          <h3 className={`font-medium ${isMobile ? "text-base" : "text-lg"} text-pink-200 truncate`}>{nft.name}</h3>
          <p className="text-sm text-pink-300/70">ID: {nft.id}</p>
        </CardContent>

        <CardFooter className={`p-${isMobile ? "3" : "4"} pt-0 flex justify-between`}>
          <div className="text-sm text-pink-300/70">{nft.frozen ? "Frozen" : "Active"}</div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
