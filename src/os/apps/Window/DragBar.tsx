import { FC, useRef, MouseEvent as ReactMouseEvent } from "react"
import { IoCloseCircle } from "react-icons/io5"
import { RiDragMoveFill } from "react-icons/ri"
import { useClickAway } from "react-use"

import { useSystem } from "@/os/system"
import { useApps } from "@/os/apps/useApps"

type DragBarProps = {
  title: string
  appId: string
  instanceId: number
  isDragging: boolean
  onChangeIsDragging: (isDragging: boolean) => void
  mouseSelectedDrag: boolean
  onChangeMouseSelectedDrag: (mouseSelectedDrag: boolean) => void
  touchSelectedDrag: boolean
  onChangeTouchSelectedDrag: (touchSelectedDrag: boolean) => void
  onCaptureInitialCoords: (
    mouseEvent: ReactMouseEvent<
      HTMLButtonElement | HTMLDivElement, 
      MouseEvent
    > | Touch) => void
}

export const DragBar: FC<DragBarProps> = ({
  title,
  appId,
  instanceId,
  isDragging,
  onChangeIsDragging,
  mouseSelectedDrag,
  onChangeMouseSelectedDrag,
  touchSelectedDrag,
  onChangeTouchSelectedDrag,
  onCaptureInitialCoords,
}) => {
  const { system } = useSystem()
  const apps = useApps()

  const dragBarClickawayRef = useRef(null)
  useClickAway(dragBarClickawayRef, () => {
    onChangeTouchSelectedDrag(false)
  })

  return (
    <div ref={dragBarClickawayRef} className={`select-none flex flex-row ml-[10px] w-[calc(100%-20px)] -mt-2 pl-4 pr-1 justify-between items-center border border-gray-500/50 bg-gray-400/40 dark:bg-gray-600/40 backdrop-blur-md h-[24px] rounded-xl cursor-move ${isDragging || touchSelectedDrag ? '!bg-gray-500/50' : ''}`} 
      onMouseDown={(mouseEvent) => {
        onChangeMouseSelectedDrag(true)
        onCaptureInitialCoords(mouseEvent)
      }}
      onMouseMove={(mouseEvent) => {
        if (mouseSelectedDrag) {
          onChangeMouseSelectedDrag(false)
          const element = mouseEvent.target as HTMLElement
          const rect = element.getBoundingClientRect()
          const touchX = mouseEvent.clientX
          const touchY = mouseEvent.clientY
          if (
            touchX >= rect.left &&
              touchX <= rect.right - 20 &&
              touchY >= rect.top &&
              touchY <= rect.bottom
          ) {
            onChangeIsDragging(true)
          }
        }          
      }}
      onMouseUp={() => {
        onChangeMouseSelectedDrag(false)
      }}
      onTouchStart={(touchEvent) => {
        if (touchSelectedDrag) {
          const touch = touchEvent.touches?.[0]
          if (touch && touch.target === touchEvent.target) {
            onCaptureInitialCoords(touch as Touch)
            onChangeIsDragging(true)
          }
        } else {
          onChangeTouchSelectedDrag(false)
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
              touchX <= rect.right - 20 &&
              touchY >= rect.top &&
              touchY <= rect.bottom
          ) {
            onChangeTouchSelectedDrag(true)
          }
        }
      }}
    >
      <p className="!select-none pointer-events-none font-window-grab">{title}</p>
      <div className="h-full flex justify-end items-center">
        {
          (touchSelectedDrag || isDragging) ? 
            <div className={`${isDragging ? 'animate-pulse' : ''} flex justify-center items-center w-4 h-4 bg-gray-900 dark:bg-gray-100 rounded-full`}> 
              <RiDragMoveFill size={16} className="text-gray-100 dark:text-gray-900" />
            </div>
            :
            <button onClick={() => {
              apps.running.close(appId, instanceId)
            }}>
              <IoCloseCircle size={18} className="opacity-80 hover:opacity-100" />
            </button>
        }
      </div>
    </div>
  )
}