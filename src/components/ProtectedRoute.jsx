import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null // ili spinner

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
