export async function register(username, password) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  if (!res.ok || !data.ok) throw new Error(data.error || "Register failed")
  return data.user
}

export async function login(username, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  if (!res.ok || !data.ok) throw new Error(data.error || "Login failed")
  return data.user
}

export async function me() {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) return null
  return data.user
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
}
