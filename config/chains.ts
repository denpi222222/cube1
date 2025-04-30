import { defineChain } from "viem"

export const apeChain = defineChain({
  id: 16350,
  name: "ApeChain",
  network: "apechain",
  nativeCurrency: {
    decimals: 18,
    name: "APE",
    symbol: "APE",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.apechain.com/"],
    },
    public: {
      http: ["https://mainnet.apechain.com/"],
    },
  },
  blockExplorers: {
    default: { name: "ApeScan", url: "https://apescan.io" },
  },
  contracts: {
    crazyCubeNFT: {
      address: "0x606a47707d5aedae9f616a6f1853fe3075ba740b",
      blockCreated: 1_234_567,
    },
    crazyToken: {
      address: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
      blockCreated: 1_234_600,
    },
  },
})

// Тестовая сеть для разработки
export const apeChainTestnet = defineChain({
  id: 16351,
  name: "ApeChain Testnet",
  network: "apechain-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "APE",
    symbol: "APE",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.apechain.com/"],
    },
    public: {
      http: ["https://testnet.apechain.com/"],
    },
  },
  blockExplorers: {
    default: { name: "ApeScan Testnet", url: "https://testnet.apescan.io" },
  },
  testnet: true,
  contracts: {
    crazyCubeNFT: {
      address: "0x606a47707d5aedae9f616a6f1853fe3075ba740b",
      blockCreated: 1_234_567,
    },
    crazyToken: {
      address: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
      blockCreated: 1_234_600,
    },
  },
})
