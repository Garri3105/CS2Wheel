function b64urlEncode(bytes) {
  let str = ""
  bytes.forEach(b => (str += String.fromCharCode(b)))
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function b64urlEncodeJson(obj) {
  const json = JSON.stringify(obj)
  const bytes = new TextEncoder().encode(json)
  return b64urlEncode(bytes)
}

async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  return b64urlEncode(new Uint8Array(sig))
}

export async function signJwt(payload, secret, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)

  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  }

  const h = b64urlEncodeJson(header)
  const p = b64urlEncodeJson(fullPayload)
  const data = `${h}.${p}`
  const s = await hmacSha256(secret, data)
  return `${data}.${s}`
}

function b64urlDecodeToString(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/")
  while (s.length % 4) s += "="
  return atob(s)
}

export async function verifyJwt(token, secret) {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [h, p, sig] = parts
  const data = `${h}.${p}`
  const expected = await hmacSha256(secret, data)
  if (expected !== sig) return null

  const payload = JSON.parse(b64urlDecodeToString(p))
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) return null

  return payload
}
