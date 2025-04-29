// API client with error handling and retry logic

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
  retries?: number
  retryDelay?: number
}

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, retries = 3, retryDelay = 1000 } = options

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Add timeout to fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new ApiError(`API error: ${response.status} ${response.statusText} - ${errorText}`, response.status)
      }

      return (await response.json()) as T
    } catch (error: any) {
      lastError = error

      // Don't retry if it's a client error (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error
      }

      // Don't retry on the last attempt
      if (attempt === retries) {
        throw error
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
    }
  }

  throw lastError || new Error("Unknown error occurred")
}

// API methods
export const api = {
  getUserBalance: async (walletAddress: string): Promise<number> => {
    try {
      const data = await apiRequest<{ balance: number }>(`/api/balance?address=${walletAddress}`)
      return data.balance
    } catch (error) {
      console.error("Failed to fetch balance:", error)
      return 0
    }
  },

  getUserNFTs: async (walletAddress: string): Promise<any[]> => {
    try {
      const data = await apiRequest<{ nfts: any[] }>(`/api/nfts?address=${walletAddress}`)
      return data.nfts
    } catch (error) {
      console.error("Failed to fetch NFTs:", error)
      return []
    }
  },

  // Add other API methods here
}
