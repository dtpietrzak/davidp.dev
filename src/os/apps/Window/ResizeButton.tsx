import { FC, useRef, MouseEvent as ReactMouseEvent } from "react"
import { useClickAway } from "react-use"
import { ResizeDirections } from "@/os/apps/Window/types"

const directionClassNameMap = {
  ne: '-top-1 -right-2 cursor-nesw-resize',
  nw: '-top-1 -left-2 cursor-nwse-resize',
  se: '-bottom-2 -right-2 cursor-nwse-resize',
  sw: '-bottom-2 -left-2 cursor-nesw-resize',
} as const

type ResizeButtonProps = {
  resizeDirection: ResizeDirections
  isResizing: ResizeDirections | null
  onChangeIsResizing: (isResizing: ResizeDirections | null) => void
  touchSelectedResize: ResizeDirections | null
  onChangeTouchSelectedResize: (
    touchSelectedResize: ResizeDirections | null
  ) => void
  onCaptureInitialCoords: (
    mouseEvent: ReactMouseEvent<
      HTMLButtonElement | HTMLDivElement, 
      MouseEvent
    > | Touch) => void
}

export const ResizeButton: FC<ResizeButtonProps> = ({
  resizeDirection,
  isResizing,
  onChangeIsResizing,
  touchSelectedResize,
  onChangeTouchSelectedResize,
  onCaptureInitialCoords,
}) => {
  const resizeClickawayRef = useRef(null)
  useClickAway(resizeClickawayRef, () => {
    onChangeTouchSelectedResize(null)
  })

  return (
    <button ref={resizeClickawayRef} className={`absolute ${directionClassNameMap[resizeDirection]} h-6 w-6 bg-gray-500/50 rounded-full ${isResizing === resizeDirection ? 'opacity-100' : 'opacity-0'} ${touchSelectedResize === resizeDirection ? '!bg-gray-500/100 !opacity-100' : ''}`}
      onMouseDown={(mouseEvent) => {
        onCaptureInitialCoords(mouseEvent)
        onChangeIsResizing(resizeDirection)
      }}
      onTouchStart={(touchEvent) => {
        if (touchSelectedResize === resizeDirection) {
          const touch = touchEvent.touches?.[0]
          if (touch && touch.target === touchEvent.target) {
            onCaptureInitialCoords(touch as Touch)
            onChangeIsResizing(resizeDirection)
          }
        } else {
          onChangeTouchSelectedResize(null)
        }
      }}
      onTouchEnd={(touchEvent) => {
        const touch = touchEvent.changedTouches?.[0]
        if (touch) {
          const element = touchEvent.target as HTMLElement
          const rect = element.getBoundingClientRect()
          const touchX = touch.clientX
          const touchY = touch.clientY
          if (
            touchX >= rect.left &&
              touchX <= rect.right &&
              touchY >= rect.top &&
              touchY <= rect.bottom
          ) {
            onChangeTouchSelectedResize(resizeDirection)
          }
        }
      }}
    />
  )
}