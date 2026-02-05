import { useEffect, useImperativeHandle, useState, forwardRef } from "react"
import "./StatsPanel.css"

const StatsPanel = forwardRef((props, ref) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    setLoading(true)
    try {
      const [lbRes, rcRes] = await Promise.all([
        fetch("/api/stats/leaderboard").then(r => r.json()),
        fetch("/api/stats/recent").then(r => r.json()),
      ])

      if (lbRes.ok) setLeaderboard(lbRes.leaderboard)
      if (rcRes.ok) setRecent(rcRes.recent)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: loadStats,
  }))

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div>
          <h3>Leaderboard</h3>

          {loading ? (
            <div className="stats-skeleton-list">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="stats-skeleton-row" />
              ))}
            </div>
          ) : (
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
          )}
        </div>

        <div>
          <h3>Last 20 spins</h3>

          {loading ? (
            <div className="recent-skeleton-grid">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="recent-skeleton-item" />
              ))}
            </div>
          ) : (
            <div className="recent-grid">
              {recent.map((r, i) => (
                <div key={i} className="recent-item" title={r.username}>
                  {r.image ? <img src={r.image} alt={r.username} /> : <span>{r.username}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default StatsPanel
