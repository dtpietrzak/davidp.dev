"use client"

import { useMousePosition } from "@/hooks/useMouseLocation"
import { useToolTip } from "@/hooks/useToolTip"
import { useCallback, useEffect, useState } from "react"

let timeInControlBarHitbox = 0

export const ControlBar = () => {
  const { y } = useMousePosition()
  const { openToolTip, closeToolTip } = useToolTip()

  const [controlBarTall, setControlBarTall] = useState(false)

  const logicClockCallback = useCallback(() => {
    if (!controlBarTall) {
      if (y >= 0 && y < 12) {
        if (timeInControlBarHitbox > 5) setControlBarTall(true)
        else timeInControlBarHitbox++
      } else {
        timeInControlBarHitbox = 0
        setControlBarTall(false)
      }
    } else {
      if (y >= 0 && y < 50) {
        if (timeInControlBarHitbox > 5) setControlBarTall(true)
        else timeInControlBarHitbox++
      } else {
        timeInControlBarHitbox = 0
        setControlBarTall(false)
      }
    }
  }, [controlBarTall, y])

  useEffect(() => {
    const intervalId = setInterval(logicClockCallback, 33)
    return () => clearInterval(intervalId)
  }, [logicClockCallback])

  return (
    <div 
      className={`fixed transition-all w-full bg-slate-500/30 backdrop-blur-xl border-b border-slate-500/50 ${controlBarTall ? 'h-12' : 'h-3'}`}
      onMouseEnter={() => openToolTip('Control Bar')}
      onMouseLeave={closeToolTip}
    >
      
    </div>
  )
}