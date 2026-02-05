function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export async function onRequestGet({ env }) {
  const rows = await env.DB.prepare(`
    SELECT username, image, created_at
    FROM wins
    ORDER BY id DESC
    LIMIT 20
  `).all()

  return json({ ok: true, recent: rows.results })
}
