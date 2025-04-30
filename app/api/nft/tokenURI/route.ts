import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { apeChain } from "@/config/chains"
import { nftAbi } from "@/config/abis/nftAbi"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("tokenId")

    if (!tokenId) {
      return NextResponse.json({ error: "Missing tokenId parameter" }, { status: 400 })
    }

    const client = createPublicClient({
      chain: apeChain,
      transport: http(),
    })

    const tokenURI = await client.readContract({
      address: apeChain.contracts.crazyCubeNFT.address as `0x${string}`,
      abi: nftAbi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    })

    return NextResponse.json({ tokenURI })
  } catch (error) {
    console.error("Error fetching token URI:", error)

    // Для демонстрации возвращаем моковые данные
    const mockTokenId = Number(tokenId)
    const cubeIndex = (mockTokenId % 8) + 1

    // Создаем моковые метаданные
    const mockMetadata = {
      name: `CrazyCube #${mockTokenId}`,
      description: "A crazy cube NFT from the CrazyCube collection",
      image: `/images/cube${cubeIndex}.png`,
      attributes: [
        {
          trait_type: "Background",
          value: ["Blue", "Red", "Green", "Purple"][Math.floor(Math.random() * 4)],
        },
        {
          trait_type: "Eyes",
          value: ["Happy", "Sad", "Angry", "Surprised"][Math.floor(Math.random() * 4)],
        },
        {
          trait_type: "Mouth",
          value: ["Smile", "Frown", "Open", "Closed"][Math.floor(Math.random() * 4)],
        },
        {
          trait_type: "Rarity",
          value: ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"][Math.floor(Math.random() * 6)],
        },
      ],
    }

    // Создаем моковый URI, который указывает на локальный эндпоинт с метаданными
    return NextResponse.json({
      tokenURI: `/api/nft/metadata?tokenId=${tokenId}`,
    })
  }
}
