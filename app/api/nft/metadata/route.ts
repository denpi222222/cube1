import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("tokenId")

    if (!tokenId) {
      return NextResponse.json({ error: "Missing tokenId parameter" }, { status: 400 })
    }

    // Для демонстрации создаем моковые метаданные
    const mockTokenId = Number(tokenId)
    const cubeIndex = (mockTokenId % 8) + 1

    // Определяем редкость на основе tokenId
    let rarity
    const rarityRoll = mockTokenId % 100
    if (rarityRoll < 50) rarity = "Common"
    else if (rarityRoll < 80) rarity = "Uncommon"
    else if (rarityRoll < 95) rarity = "Rare"
    else if (rarityRoll < 98) rarity = "Epic"
    else if (rarityRoll < 99.5) rarity = "Legendary"
    else rarity = "Mythic"

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
          value: rarity,
        },
      ],
    }

    return NextResponse.json(mockMetadata)
  } catch (error) {
    console.error("Error generating metadata:", error)
    return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 })
  }
}
