function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

function randomSaltHex(len = 16) {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("")
}

async function hashPassword(password, saltHex) {
  const enc = new TextEncoder()

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g).map(x => parseInt(x, 16))
  )

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  )

  return toHex(bits)
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null)
  const username = body?.username?.trim()
  const password = body?.password

  if (!username || !password) {
    return json({ ok: false, error: "Missing username/password" }, 400)
  }

  const salt = randomSaltHex(16)
  const password_hash = await hashPassword(password, salt)

  try {
    const stmt = env.DB.prepare(
      "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)"
    ).bind(username, password_hash, salt)

    const res = await stmt.run()
    return json({ ok: true, user: { id: res.meta.last_row_id, username } })
  } catch {
    return json({ ok: false, error: "Username already exists" }, 409)
  }
}
