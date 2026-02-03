import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null // može i loader/spinner

  if (!user) return <Navigate to="/auth" replace />

  return children
}