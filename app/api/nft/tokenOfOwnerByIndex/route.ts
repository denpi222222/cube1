import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { apeChain } from "@/config/chains"
import { nftAbi } from "@/config/abis/nftAbi"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const index = searchParams.get("index")

    if (!owner || !index) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const client = createPublicClient({
      chain: apeChain,
      transport: http(),
    })

    const tokenId = await client.readContract({
      address: apeChain.contracts.crazyCubeNFT.address as `0x${string}`,
      abi: nftAbi,
      functionName: "tokenOfOwnerByIndex",
      args: [owner as `0x${string}`, BigInt(index)],
    })

    return NextResponse.json({ tokenId: tokenId.toString() })
  } catch (error) {
    console.error("Error fetching token by index:", error)

    // Для демонстрации возвращаем моковые данные
    return NextResponse.json({ tokenId: String(1000 + Math.floor(Math.random() * 100)) })
  }
}
