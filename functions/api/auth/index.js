export async function onRequestGet() {
  return Response.json({ ok: true, msg: "auth api works" })
}
