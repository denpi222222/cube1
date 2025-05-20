"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { BuildErrorDisplay } from "@/components/build-error-display"
import { SocialSidebar } from "@/components/social-sidebar"
import { setupGlobalErrorHandling } from "@/utils/logger"
import { ErrorBoundary } from "@/components/error-boundary"
import { useEffect } from "react"
// Import i18n
import "@/lib/i18n"
// Import Web3 provider
import { WagmiProvider } from "wagmi"
import { config } from "@/config/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Initialize global error handling on client
const initGlobalErrorHandling = () => {
  if (typeof window !== "undefined") {
    setupGlobalErrorHandling()
  }
}

const inter = Inter({ subsets: ["latin"] })

// Create a client for React Query
const queryClient = new QueryClient()

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Initialize i18n on client side
  useEffect(() => {
    // This ensures i18n is fully initialized on the client side
    const initI18n = async () => {
      try {
        const i18n = (await import("@/lib/i18n")).default
        if (i18n && !i18n.isInitialized) {
          await i18n.init()
        }
      } catch (error) {
        console.error("Failed to initialize i18n:", error)
      }
    }

    initI18n()
  }, [])

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <div className={inter.className}>
                {children}
                <Toaster />
                <BuildErrorDisplay />
                <SocialSidebar />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `(${initGlobalErrorHandling.toString()})();`,
                  }}
                />
              </div>
            </ErrorBoundary>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </>
  )
}
