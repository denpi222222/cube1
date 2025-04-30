"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/contexts/web3-context"

// Типы для NFT
export type NFT = {
  id: string
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  rarity?: string
}

// Моковые данные для NFT
const mockNFTs: NFT[] = [
  {
    id: "1",
    name: "Crazy Cube #1",
    description: "A rare cube with special powers",
    image: "/images/cube1.png",
    attributes: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Eyes", value: "Happy" },
      { trait_type: "Mouth", value: "Smile" },
    ],
    rarity: "Common",
  },
  {
    id: "2",
    name: "Crazy Cube #2",
    description: "An epic cube with magical abilities",
    image: "/images/cube2.png",
    attributes: [
      { trait_type: "Background", value: "Red" },
      { trait_type: "Eyes", value: "Angry" },
      { trait_type: "Mouth", value: "Open" },
      { trait_type: "Hat", value: "Crown" },
    ],
    rarity: "Rare",
  },
  {
    id: "3",
    name: "Crazy Cube #3",
    description: "A legendary cube with cosmic powers",
    image: "/images/cube3.png",
    attributes: [
      { trait_type: "Background", value: "Gold" },
      { trait_type: "Eyes", value: "Star" },
      { trait_type: "Mouth", value: "Diamond" },
      { trait_type: "Hat", value: "Wizard" },
      { trait_type: "Accessory", value: "Wand" },
    ],
    rarity: "Legendary",
  },
  {
    id: "4",
    name: "Crazy Cube #4",
    description: "A mythic cube with universe-altering abilities",
    image: "/images/cube4.png",
    attributes: [
      { trait_type: "Background", value: "Galaxy" },
      { trait_type: "Eyes", value: "Universe" },
      { trait_type: "Mouth", value: "Black Hole" },
      { trait_type: "Hat", value: "Cosmic Crown" },
      { trait_type: "Accessory", value: "Nebula Cape" },
      { trait_type: "Aura", value: "Multiverse" },
    ],
    rarity: "Mythic",
  },
]

// Функция для определения редкости NFT
export function determineRarity(nft: NFT): string {
  // Если редкость уже указана, используем ее
  if (nft.rarity) return nft.rarity

  // Ищем атрибут редкости
  const rarityAttribute = nft.attributes.find(
    (attr) =>
      attr.trait_type.toLowerCase() === "rarity" ||
      attr.trait_type.toLowerCase() === "tier" ||
      attr.trait_type.toLowerCase() === "rank",
  )

  if (rarityAttribute) return String(rarityAttribute.value)

  // Определяем редкость по количеству атрибутов
  const attrCount = nft.attributes.length

  if (attrCount <= 3) return "Common"
  if (attrCount <= 4) return "Rare"
  if (attrCount <= 5) return "Epic"
  if (attrCount <= 6) return "Legendary"
  return "Mythic"
}

// Хук для получения NFT
export function useNFTs() {
  const { account, isConnected, isCorrectChain } = useWeb3()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Функция для получения NFT
    const fetchNFTs = async () => {
      // Если пользователь не подключен или не в правильной сети, используем моковые данные
      if (!isConnected || !isCorrectChain || !account) {
        setNfts(mockNFTs)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // В реальном приложении здесь был бы запрос к блокчейну
        // Для демонстрации используем моковые данные с задержкой
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Добавляем редкость к NFT
        const nftsWithRarity = mockNFTs.map((nft) => ({
          ...nft,
          rarity: determineRarity(nft),
        }))

        setNfts(nftsWithRarity)
      } catch (err) {
        console.error("Ошибка при получении NFT:", err)
        setError("Не удалось загрузить NFT. Пожалуйста, попробуйте позже.")
        // Используем моковые данные в случае ошибки
        setNfts(mockNFTs)
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [account, isConnected, isCorrectChain])

  return { nfts, loading, error }
}
