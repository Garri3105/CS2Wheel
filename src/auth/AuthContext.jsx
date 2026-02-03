import { createContext, useContext, useEffect, useState } from "react"
import * as api from "./apiAuthService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const u = await api.me()
      setUser(u)
      setLoading(false)
    })()
  }, [])

  const login = (userData) => setUser(userData)

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
