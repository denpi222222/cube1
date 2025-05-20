import { createConfig, http } from "wagmi"
import { metaMask } from "wagmi/connectors"
import { apeChain, apeChainTestnet } from "./chains"

// Определяем конфигурацию для Wagmi
export const config = createConfig({
  chains: [apeChain, apeChainTestnet],
  transports: {
    [apeChain.id]: http(),
    [apeChainTestnet.id]: http(),
  },
  connectors: [metaMask()],
})

// Экспортируем константы для использования в приложении
export const CHAIN_ID = apeChain.id
export const NFT_CONTRACT_ADDRESS = apeChain.contracts.crazyCubeNFT.address
export const TOKEN_CONTRACT_ADDRESS = apeChain.contracts.crazyToken.address
