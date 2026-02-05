import { useState } from "react"
import Header from "../components/Header/Header"
import WheelSection from "../components/Wheel/WheelSection"

export default function AppPage() {
  const [showStats, setShowStats] = useState(false)

  return (
    <>
      <Header onToggleStats={() => setShowStats(s => !s)} />
      <WheelSection
        showStats={showStats}
        onCloseStats={() => setShowStats(false)}
      />
    </>
  )
}
