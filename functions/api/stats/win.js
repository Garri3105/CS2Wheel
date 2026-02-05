import { verifyJwt } from "../auth/_jwt"

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

export async function onRequestPost({ request, env }) {
  const token = getCookie(request, "session")
  if (!token) return json({ ok: false }, 401)

  const payload = await verifyJwt(token, env.JWT_SECRET)
  if (!payload) return json({ ok: false }, 401)

  const body = await request.json().catch(() => null)

  // winner objekat sa fronta
  const winnerUserId = body?.user_id
  const winnerUsername = body?.username
  const winnerImage = body?.image || null

  if (!winnerUserId || !winnerUsername) {
    return json({ ok: false, error: "Missing winner fields" }, 400)
  }

  await env.DB.prepare(
    "INSERT INTO wins (user_id, username, image) VALUES (?, ?, ?)"
  ).bind(winnerUserId, winnerUsername, winnerImage).run()

  return json({ ok: true })
}
