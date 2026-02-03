import { signJwt } from "./_jwt"

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  })
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
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
  try {
    const body = await request.json().catch(() => null)
    const username = body?.username?.trim()
    const password = body?.password

    if (!username || !password) {
      return json({ ok: false, error: "Missing username/password" }, 400)
    }

    const row = await env.DB.prepare(
      "SELECT id, username, password_hash, salt FROM users WHERE username = ?"
    ).bind(username).first()

    if (!row) return json({ ok: false, error: "Invalid credentials" }, 401)

    const check = await hashPassword(password, row.salt)
    if (check !== row.password_hash) {
      return json({ ok: false, error: "Invalid credentials" }, 401)
    }

    if (!env.JWT_SECRET) {
      return json({ ok: false, error: "JWT_SECRET missing (needs redeploy)" }, 500)
    }

    const token = await signJwt(
      { uid: row.id, username: row.username },
      env.JWT_SECRET
    )

    return json(
      { ok: true, user: { id: row.id, username: row.username } },
      200,
      {
        "Set-Cookie": `session=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=604800`,
      }
    )
  } catch (e) {
    // 🔥 OVO će ti pokazati pravi uzrok umesto HTML error stranice
    return json({ ok: false, error: String(e?.message || e) }, 500)
  }
}
