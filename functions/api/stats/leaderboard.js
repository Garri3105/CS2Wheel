function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export async function onRequestGet({ env }) {
  const totalRow = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM wins"
  ).first()

  const totalSpins = totalRow?.total || 0

  const rows = await env.DB.prepare(`
    SELECT user_id, username, image, COUNT(*) as wins
    FROM wins
    GROUP BY user_id, username, image
    ORDER BY wins DESC
    LIMIT 10
  `).all()

  return json({
    ok: true,
    totalSpins,
    leaderboard: rows.results,
  })
}
