import "./WheelSection.css"
import characters from "/src/data/characters.json"
import { useRef, useState } from "react"
import StatsPanel from "../StatsPanel/StatsPanel"


function WheelSection() {
    const [items, setItems] = useState([])
    const [rotation, setRotation] = useState(0)
    const [spinning, setSpinning] = useState(false)
    const [winner, setWinner] = useState(null)
    const [showWinner, setShowWinner] = useState(false)
    const [winnerHistory, setWinnerHistory] = useState([])
    const MAX_WINNERS = 5
    const slotsLeft = MAX_WINNERS - winnerHistory.length
    const isInWheel = (id) => {
        return items.some(item => item.id === id)
    }
    const isInWinnerHistory = (id) => {
        return winnerHistory.some(w => w?.id === id)
    }
    const removeFromWinnerHistory = (indexToRemove) => {
        setWinnerHistory(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        )
    }
    const statsRef = useRef(null)
    const [showStats, setShowStats] = useState(false)



    const toggleInWheel = (character) => {
        if(isInWinnerHistory(character.id)) return

        setItems(prevItems => {
            const exists = prevItems.some(item => item.id === character.id)

            if (exists) {
            // izbaci iz točka
            return prevItems.filter(item => item.id !== character.id)
            } else {
            // dodaj u točak
            return [...prevItems, character]
            }
        })
    }

    const removeWinner = async () => {
        try {
            await fetch("/api/stats/win", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                user_id: winner.id,
                username: winner.username,
                image: winner.image,
            }),
            })

            statsRef.current?.refresh()
        } catch (e) {
            console.error("Stats save failed", e)
        }

        addWinnerToHistory(winner)
        setItems(items.filter(i => i.id !== winner.id))
        setWinner(null)
        setShowWinner(false)
    }



    const addWinnerToHistory = (winner) => {
        setWinnerHistory(prev => {
            const newHistory = [...prev, winner]
            if (newHistory.length > 5) {
                newHistory.shift()
            }
            return newHistory
        })
    }

    const size = 300
    const r = size / 2
    const x = size / 2
    const y = size / 2
    const sliceAngle = 360 / items.length

    function polarToCartesian(cx, cy, radius, angle) {
        const rad = (angle - 90) * Math.PI / 180
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad)
        }
    }

    function createSlice(startAngle, endAngle) {
        const start = polarToCartesian(x, y, r, endAngle)
        const end = polarToCartesian(x, y, r, startAngle)
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

        return `
            M ${x} ${y}
            L ${start.x} ${start.y}
            A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
            Z
        `
    }

    // spin
    const handleSpin = () => {
        if (spinning || items.length === 0 || slotsLeft <= 0) return

        const sliceAngle = 360 / items.length

        const minTurns = 3
        const maxTurns = 10
        const turns = Math.floor(Math.random() * (maxTurns - minTurns + 1)) + minTurns

        const randomOffset = Math.random() * 360
        const targetRotation = 360 * turns + randomOffset

        // pozicija pobednika
        const finalRotation = (rotation + targetRotation) % 360
        const winnerIndex = Math.floor((360 - finalRotation) / sliceAngle) % items.length
        const winnerItem = items[winnerIndex]

        setSpinning(true)
        setRotation(prev => prev + targetRotation)

        // Timeout i prikaz pobednika
        setTimeout(() => {
            setSpinning(false)
            setWinner(winnerItem)
            setShowWinner(true)
        }, 5000)
        }

    return (
    <div className="wheel-container">

    {showStats && (
    <div style={{
        position: "fixed",
        top: "70px",
        right: "20px",
        zIndex: 2000
    }}>
        <StatsPanel ref={statsRef} />
    </div>
    )}


    {showWinner && winner && (
        <div className="winner-overlay">
        <div className="winner-modal">
            <h2>🏆 Igra</h2>
            <h1>{winner.username}</h1>

            <div
            className="winner-name"
            style={{ 
                backgroundImage: `url(${winner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            />

            <div className="winner-actions">
            <button className="remove-btn" onClick={removeWinner}>
                Remove
            </button>
            <button
                className="close-btn"
                onClick={() => setShowWinner(false)}
            >
                Close
            </button>
            </div>
        </div>
        </div>
    )}

    {/* ⬇⬇⬇ GLAVNI LAYOUT ⬇⬇⬇ */}
    <div className="main-layout">

        {/* LEVO – CHARACTER LIST */}
        <div className="character-list">
        {characters.map(character => {
            const inWheel = isInWheel(character.id)
            const inHistory = isInWinnerHistory(character.id)

            return (
                <button
                    key={character.id}
                    className={`character-card ${inWheel ? "in-wheel" : ""} ${inHistory ? "in-history" : ""}`}
                    onClick={() => toggleInWheel(character)}
                    disabled={spinning || inHistory}
                    style={{
                        opacity: spinning ? 0.5 : 1,
                        cursor: spinning ? "not-allowed" : "pointer",
                        cursor: inHistory ? "not-allowed" : "pointer"
                    }}
                    >
                    {character.username}
                </button>
            )
        })}
        </div>

        {/* SREDINA – TOČAK */}
        <div className="wheel-center">
        <svg
            width="500"
            height="500"
            viewBox="0 0 300 300"
            style={{ background: "#454545", borderRadius: "50%"}}
        >
            <defs>
            {items.map(item => (
                <pattern
                key={item.id}
                id={`img-${item.id}`}
                patternUnits="objectBoundingBox"
                width="1"
                height="1"
                >
                <image
                    href={item.image}
                    width="300"
                    height="300"
                    preserveAspectRatio="xMidYMid slice"
                />
                </pattern>
            ))}
            </defs>

            <g
            className="wheel-group"
            style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "50% 50%",
            }}
            >
            {items.length === 1 ? (
                <circle
                cx={x}
                cy={y}
                r={r}
                fill={`url(#img-${items[0].id})`}
                />
            ) : (
                items.map((item, index) => {
                const startAngle = index * sliceAngle
                const endAngle = startAngle + sliceAngle

                return (
                    <path
                    key={item.id}
                    d={createSlice(startAngle, endAngle)}
                    fill={`url(#img-${item.id})`}
                    stroke="#000000"
                    strokeWidth="1"
                    />
                )
                })
            )}
            </g>

            {/* strelica */}
            <polygon
            points={`${x - 10},0 ${x + 10},0 ${x},30`}
            fill="#1a1a1a"
            stroke="#7613ff"
            strokeWidth="1"
            />
        </svg>

        <button
            onClick={handleSpin}
            disabled={spinning}
            style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontSize: "1.5em",
                opacity: spinning || slotsLeft <= 0 ? 0.5 : 1,
                cursor:
                spinning || slotsLeft <= 0 ? "not-allowed" : "pointer",
            }}
            >
            {slotsLeft <= 0
                ? "No spins left"
                : `Spin (${slotsLeft})`}
        </button>
        </div>

        {/* DESNO – WINNER HISTORY */}
        <div className="winner-history">
        {Array.from({ length: 5 }).map((_, index) => {
            const entry = winnerHistory[index]

            return (
            <div key={index} className="winner-slot" onClick={() => entry /*{&& removeFromWinnerHistory(index)}*/}
                style={{cursor: entry? "pointer" : "default"}}>
                {entry?.image && (
                <img
                    src={entry.image}
                    alt={entry.username}
                    className="winner-image-full"
                />
                )}
            </div>
            )
        })}
        </div>

    </div>
    </div> 
  )
}

export default WheelSection