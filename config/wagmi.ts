import { createClient, configureChains } from "wagmi"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

// DRPC API ключ для ApeChain
const DRPC_API_KEY = "Au5RdIeRnkBeul8kEtgurMAbZfw7F3UR8J5yThukG97E"
const APECHAIN_RPC_URL = `https://lb.drpc.org/ogrpc?network=apechain&dkey=${DRPC_API_KEY}`

// Определяем ApeChain с использованием DRPC
export const apeChain = {
  id: 16350,
  name: "ApeChain",
  network: "apechain",
  nativeCurrency: {
    decimals: 18,
    name: "APE",
    symbol: "APE",
  },
  rpcUrls: {
    default: { http: [APECHAIN_RPC_URL] },
    public: { http: [APECHAIN_RPC_URL] },
  },
  blockExplorers: {
    default: { name: "ApeScan", url: "https://apescan.io" },
  },
  contracts: {
    crazyCubeNFT: {
      address: "0x606a47707d5aedae9f616a6f1853fe3075ba740b",
    },
    crazyToken: {
      address: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
    },
  },
}

// Для демонстрации добавим поддержку Ethereum Mainnet и Polygon
export const mainnet = {
  id: 1,
  name: "Ethereum",
  network: "mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://eth-mainnet.g.alchemy.com/v2/demo"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
}

export const polygon = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://polygonscan.com" },
  },
}

// Настраиваем цепи и провайдеры с приоритетом на DRPC для ApeChain
const { chains, provider } = configureChains(
  [apeChain, mainnet, polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === apeChain.id) {
          return { http: APECHAIN_RPC_URL }
        }
        return null
      },
    }),
    publicProvider(),
  ],
)

// Создаем клиент wagmi
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
})

// Экспортируем константы для использования в приложении
export const NFT_CONTRACT_ADDRESS = apeChain.contracts.crazyCubeNFT.address
export const TOKEN_CONTRACT_ADDRESS = apeChain.contracts.crazyToken.address
