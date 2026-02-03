import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import * as auth from "../../auth/fakeAuthService"
import "./AuthPage.css"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login: setAuthUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    try {
        const user = isLogin
            ? auth.login(username, password)
            : auth.register(username, password)
        setAuthUser(user)
        navigate("/")
    } catch (err) {
        setError(err.message)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isLogin ? "Login" : "Register"}</h1>

        {error && <div className="auth-error">{error}</div>}

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isLogin ? "Login" : "Create account"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "No account? Register"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  )
}
