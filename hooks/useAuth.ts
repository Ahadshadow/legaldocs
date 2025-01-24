import { useState, useEffect } from "react"
import { getUserData, getAccessToken } from "../lib/utils"

export function useAuth() {
  // Initialize with null to indicate loading state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = getUserData()
      const accessToken = getAccessToken()
      setIsLoggedIn(!!userData && !!accessToken)
      setIsInitialized(true)
    }

    checkAuthStatus()

    window.addEventListener("storage", checkAuthStatus)

    return () => {
      window.removeEventListener("storage", checkAuthStatus)
    }
  }, [])

  return {
    isLoggedIn,
    isLoading: !isInitialized,
    isInitialized,
  }
}

