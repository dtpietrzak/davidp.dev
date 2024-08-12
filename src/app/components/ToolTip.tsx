"use client"

import { useMousePosition } from "@/hooks/useMouseLocation"
import { useElementSize } from "@/hooks/useResizeObserver"
import { useWindowSize } from "@/hooks/useWindowSize"
import { FC } from "react"

type ToolTipProps = {
  show: boolean
  text: string
}

export const ToolTip: FC<ToolTipProps> = ({
  show = false,
  text = "",
}) => {
  const { x, y } = useMousePosition()
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { ref, width: elementWidth, height: elementHeight } = useElementSize()

  if (!show) return null

  return (
    <div
      ref={ref}
      className={`fixed z-50 py-1 px-2 bg-gray-800/30 border border-gray-400/50 text-white/80 rounded-lg max-w-32 backdrop-blur-xl`}
      style={{
        top: y > (windowHeight - (elementHeight + 30)) ? 
          (y - elementHeight - 10) : y + 10,
        left: x > (windowWidth - (elementWidth + 30)) ? 
          (x - elementWidth - 20) : x + 20,
      }}
    >
      <p className="text-sm">{text}</p>
    </div>
  )
}