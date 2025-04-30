"use client"

import type React from "react"

import { WagmiConfig } from "wagmi"
import { wagmiClient } from "@/config/wagmi"

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
