import { useAuth } from "../../auth/AuthContext"
import "./Header.css"

export default function Header({ onToggleStats }) {
  const { user, logout } = useAuth()

  return (
    <header className="app-header">
      {/* LEVO */}
      <div className="header-left">
        {user && <span className="header-user">{user.username}</span>}
      </div>

      {/* CENTAR */}
      <div className="header-center">
        <h2>CS2 Wheel</h2>
      </div>

      {/* DESNO */}
      <div className="header-right">
        <button className="stats-btn" onClick={onToggleStats}>
          Stats
        </button>
        {user && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
