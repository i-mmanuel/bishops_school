'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { PRINCIPAL } from './mock-data'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function login(email: string, password: string): boolean {
    if (email === PRINCIPAL.email && password === PRINCIPAL.password) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  function logout() { setIsAuthenticated(false) }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
