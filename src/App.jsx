import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthPage from "./Pages/Auth/AuthPage"
import AppPage from "./Pages/AppPage"

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/auth" element={<AuthPage />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
