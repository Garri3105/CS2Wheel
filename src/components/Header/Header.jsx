import { useAuth } from "../../auth/AuthContext"
import "./Header.css"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header>
      <div>{user ? `Ulogovan: ${user.username}` : "Nisi ulogovan"}</div>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  )
}
