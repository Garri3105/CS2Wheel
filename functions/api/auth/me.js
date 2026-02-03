import { verifyJwt } from "./_jwt"

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || ""
  const parts = cookie.split(";").map(v => v.trim())
  for (const part of parts) {
    if (part.startsWith(name + "=")) return part.slice(name.length + 1)
  }
  return null
}

export async function onRequestGet({ request, env }) {
  const token = getCookie(request, "session")
  if (!token) return json({ ok: false }, 401)

  const payload = await verifyJwt(token, env.JWT_SECRET)
  if (!payload) return json({ ok: false }, 401)

  return json({ ok: true, user: { id: payload.uid, username: payload.username } })
}
