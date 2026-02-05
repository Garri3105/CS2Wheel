import { useEffect, useImperativeHandle, useState, forwardRef } from "react"
import "./StatsPanel.css"

const StatsPanel = forwardRef((props, ref) => {
    const [leaderboard, setLeaderboard] = useState([])
    const [recent, setRecent] = useState([])

    const loadStats = async () => {
        const lb = await fetch("/api/stats/leaderboard").then(r => r.json())
        if (lb.ok) setLeaderboard(lb.leaderboard)

        const rc = await fetch("/api/stats/recent").then(r => r.json())
        if (rc.ok) setRecent(rc.recent)
    }

    useEffect(() => {
        loadStats()
    }, [])

    useImperativeHandle(ref, () => ({
        refresh: loadStats,
    }))

    return (
        <div className="stats-panel">
        <h3>Leaderboard</h3>

        <div className="stats-list">
            {leaderboard.map((row, i) => (
            <div key={row.user_id} className="stats-row">
                <span className="rank">#{i + 1}</span>
                {row.image && <img src={row.image} className="avatar" />}
                <span className="name">{row.username}</span>
                <span className="wins">{row.wins}</span>
            </div>
            ))}
        </div>

        <h3>Last 20 spins</h3>

        <div className="recent-grid">
            {recent.map((r, i) => (
            <div key={i} className="recent-item">
                {r.image ? <img src={r.image} /> : <span>{r.username}</span>}
            </div>
            ))}
        </div>
        </div>
    )
})

export default StatsPanel
