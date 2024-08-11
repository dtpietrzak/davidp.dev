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
  const { width: windowWidth } = useWindowSize()
  const { ref, width: elementWidth } = useElementSize()

  if (show === false) return null

  return (
    <div
      ref={ref}
      className={`fixed z-50 py-1 px-2 bg-slate-800/30 border border-slate-400/50 text-white/80 rounded-lg max-w-32 backdrop-blur-xl`}
      style={{
        top: y + 10,
        left: x > (windowWidth - (elementWidth + 30)) ? 
          (x - elementWidth - 16) : x + 10,
      }}
    >
      <p className="text-sm">{text}</p>
    </div>
  )
}