"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  name: string
  principal: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Simulate authentication with Internet Identity
  const login = () => {
    // In a real implementation, this would integrate with Internet Identity
    console.log("Authenticating with Internet Identity...")

    // Simulate successful authentication
    setTimeout(() => {
      const mockUser = {
        name: "Demo User",
        principal: "2vxsx-fae",
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("auth", JSON.stringify({ isAuthenticated: true, user: mockUser }))
    }, 1000)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("auth")
  }

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth")
    if (storedAuth) {
      const { isAuthenticated, user } = JSON.parse(storedAuth)
      setIsAuthenticated(isAuthenticated)
      setUser(user)
    }
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

