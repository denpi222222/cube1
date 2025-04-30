"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type NFT, determineRarity } from "@/hooks/useNFTs"

// Цвета для разных редкостей
const rarityColors: Record<string, string> = {
  Common: "bg-gray-200 text-gray-800",
  Uncommon: "bg-green-200 text-green-800",
  Rare: "bg-blue-200 text-blue-800",
  Epic: "bg-purple-200 text-purple-800",
  Legendary: "bg-yellow-200 text-yellow-800",
  Mythic: "bg-red-200 text-red-800",
}

// Градиенты для фона карточек
const rarityGradients: Record<string, string> = {
  Common: "bg-gradient-to-br from-gray-100 to-gray-300",
  Uncommon: "bg-gradient-to-br from-green-100 to-green-300",
  Rare: "bg-gradient-to-br from-blue-100 to-blue-300",
  Epic: "bg-gradient-to-br from-purple-100 to-purple-300",
  Legendary: "bg-gradient-to-br from-yellow-100 to-yellow-300",
  Mythic: "bg-gradient-to-br from-red-100 to-red-300",
}

export function NFTCard({ nft }: { nft: NFT }) {
  const [flipped, setFlipped] = useState(false)

  // Определяем редкость NFT
  const rarity = determineRarity(nft)

  // Получаем цвет и градиент для редкости
  const rarityColor = rarityColors[rarity] || rarityColors.Common
  const rarityGradient = rarityGradients[rarity] || rarityGradients.Common

  return (
    <div className="perspective-1000 cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? "rotate-y-180" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Передняя сторона карточки */}
        <Card
          className={`absolute w-full h-full backface-hidden ${rarityGradient} border-2 ${flipped ? "invisible" : "visible"}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent className="p-4 flex flex-col items-center">
            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
              <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <h3 className="font-bold text-lg">{nft.name}</h3>
              <Badge className={rarityColor}>{rarity}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Задняя сторона карточки */}
        <Card
          className={`absolute w-full h-full backface-hidden ${rarityGradient} border-2 ${flipped ? "visible" : "invisible"}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardContent className="p-4 flex flex-col gap-2">
            <h3 className="font-bold text-lg text-center">{nft.name}</h3>
            <p className="text-sm text-gray-700">{nft.description}</p>
            <div className="mt-2">
              <h4 className="font-semibold text-sm mb-1">Атрибуты:</h4>
              <div className="grid grid-cols-2 gap-1">
                {nft.attributes.map((attr, index) => (
                  <div key={index} className="text-xs bg-white/50 rounded p-1">
                    <span className="font-medium">{attr.trait_type}:</span> {attr.value}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
