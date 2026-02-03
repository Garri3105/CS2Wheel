export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "session=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0",
    },
  })
}
