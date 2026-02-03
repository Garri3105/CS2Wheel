export async function onRequest(context) {
  return new Response(
    JSON.stringify({ status: "auth api works" }),
    { headers: { "Content-Type": "application/json" } }
  )
}
