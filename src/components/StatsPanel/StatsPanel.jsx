import { useEffect, useImperativeHandle, useState, forwardRef } from "react"
import "./StatsPanel.css"

const EXTRA_SPIN_MS = 1000

const StatsPanel = forwardRef((props, ref) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    setLoading(true)

    const started = Date.now()

    try {
      const [lbRes, rcRes] = await Promise.all([
        fetch("/api/stats/leaderboard").then(r => r.json()),
        fetch("/api/stats/recent").then(r => r.json()),
      ])

      if (lbRes.ok) setLeaderboard(lbRes.leaderboard)
      if (rcRes.ok) setRecent(rcRes.recent)
    } catch (e) {
      // dodati error UI kasnije
      console.error("Failed to load stats", e)
    } finally {
      // spinner vrti bar jos 1s nakon sto se sve ucita
      const elapsed = Date.now() - started
      const wait = Math.max(EXTRA_SPIN_MS - elapsed, 0)

      setTimeout(() => {
        setLoading(false)
      }, wait)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: loadStats,
  }))

  if (loading) {
    return (
      <div className="stats-panel stats-panel--loading">
        <div className="stats-loading">
          <div className="spinner" />
          <div className="loading-text">Loading stats...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div>
          <h3>Leaderboard</h3>
          <div className="stats-list">
            {leaderboard.map((row, i) => (
              <div key={row.user_id} className="stats-row">
                <span className="rank">#{i + 1}</span>
                {row.image && <img className="avatar" src={row.image} alt={row.username} />}
                <span className="name">{row.username}</span>
                <span className="wins">{row.wins}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Last 20 spins</h3>
          <div className="recent-grid">
            {recent.map((r, i) => (
              <div key={i} className="recent-item" title={r.username}>
                {r.image ? <img src={r.image} alt={r.username} /> : <span>{r.username}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default StatsPanel
