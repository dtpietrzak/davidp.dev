"use client"

import { useEffect, useState, MouseEvent as ReactMouseEvent, useCallback, FC, useRef } from "react"

import { useClickAway } from "react-use"

import { DragBar } from "@/os/windows/Window/DragBar"
import { ResizeDirections } from "@/os/windows/Window/types"
import { ResizeButton } from "@/os/windows/Window/ResizeButton"

// there is a bug in the dragging on mobile code, that caused the touchSelectedDrag to flash false/true/false at the end of a legitimate drag

const minWidth = 240
const minHeight = 160

const clampX = (x: number, screenWidth: number) => {
  if (x < -200) return -200
  if (x > screenWidth - 120) return screenWidth - 120
  return x
}

const clampY = (y: number, screenHeight: number) => {
  if (y < 10) return 10
  if (y > screenHeight - 50) return screenHeight - 50
  return y
}

const clampWidth = (width: number) => {
  if (width < minWidth) return minWidth
  return width
}

const clampHeight = (height: number) => {
  if (height < minHeight) return minHeight
  return height
}

type WindowProps = {
  title: string
  windowId: string
  userId: string
  children: React.ReactNode
}

export const Window: FC<WindowProps> = ({
  title,
  children, 
  windowId, 
  userId,
}) => {
  const id = useCallback((_id: string) => {
    return `window-${userId}-${windowId}-${_id}`
  }, [userId, windowId])

  const [_x, setX] = useState(localStorage.getItem(id('x')) ? parseInt(localStorage.getItem(id('x'))!) : 7)
  const _setX = (x: number) => setX(clampX(x, window?.innerWidth ?? 0))
  const [_y, setY] = useState(localStorage.getItem(id('y')) ? parseInt(localStorage.getItem(id('y'))!) : 12)
  const _setY = (y: number) => setY(clampY(y, window?.innerHeight ?? 0))
  const [_width, setWidth] = useState(localStorage.getItem(id('width')) ? parseInt(localStorage.getItem(id('width'))!) : minWidth)
  const _setWidth = (width: number) => setWidth(clampWidth(width))
  const [_height, setHeight] = useState(localStorage.getItem(id('height')) ? parseInt(localStorage.getItem(id('height'))!) : minHeight)
  const _setHeight = (height: number) => setHeight(clampHeight(height))

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<ResizeDirections | null>(null)

  const [initialX, setInitialX] = useState(_x)
  const [initialY, setInitialY] = useState(_y)
  const [initialXClick, setInitialXClick] = useState(0)
  const [initialYClick, setInitialYClick] = useState(0)
  const [initialWidth, setInitialWidth] = useState(_width)
  const [initialHeight, setInitialHeight] = useState(_height)

  const [mouseSelectedDrag, setMouseSelectedDrag] = useState(false)
  const [touchSelectedDrag, setTouchSelectedDrag] = useState(false)
  const [touchSelectedResize, setTouchSelectedResize] = useState<ResizeDirections | null>(null)

  const neResizeClickawayRef = useRef(null)
  useClickAway(neResizeClickawayRef, () => {
    setTouchSelectedResize(null)
  })

  const nwResizeClickawayRef = useRef(null)
  useClickAway(nwResizeClickawayRef, () => {
    setTouchSelectedResize(null)
  })

  const seResizeClickawayRef = useRef(null)
  useClickAway(seResizeClickawayRef, () => {
    setTouchSelectedResize(null)
  })

  const swResizeClickawayRef = useRef(null)
  useClickAway(swResizeClickawayRef, () => {
    setTouchSelectedResize(null)
  })

  const hasBeenDragged = useCallback(() => {
    if (initialX !== _x || initialY !== _y) {
      return true
    }
  }, [initialX, initialY, _x, _y])

  useEffect(() => {
    if (hasBeenDragged()) {
      setTouchSelectedDrag(false)
    }
  }, [hasBeenDragged, isDragging])

  const hasBeenResized = useCallback(() => {
    if (initialWidth !== _width || initialHeight !== _height) {
      return true
    }
  }, [_height, _width, initialHeight, initialWidth])

  useEffect(() => {
    if (hasBeenResized()) {
      setTouchSelectedResize(null)
    }
  }, [hasBeenResized, isResizing])

  useEffect(() => {
    setTouchSelectedDrag(false)

    const mouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
      localStorage.setItem(id('x'), _x.toString())
      localStorage.setItem(id('y'), _y.toString())
      localStorage.setItem(id('width'), _width.toString())
      localStorage.setItem(id('height'), _height.toString())
    }
    addEventListener('mouseup', mouseUp)
    addEventListener('touchend', mouseUp)
    addEventListener('touchcancel', mouseUp)
    return () => {
      removeEventListener('mouseup', mouseUp)
      removeEventListener('touchend', mouseUp)
      removeEventListener('touchcancel', mouseUp)
    }
  }, [_height, _width, _x, _y, id])

  const convertMouseOrTouchToMouse = (mouseEvent: MouseEvent | TouchEvent) => {
    if (mouseEvent.type === 'touchmove') {
      mouseEvent.preventDefault()
      mouseEvent = 
        (mouseEvent as TouchEvent).touches[0] as unknown as MouseEvent
    }
    return mouseEvent as MouseEvent
  }

  useEffect(() => {
    const mouseMove = (mouseEvent: MouseEvent | TouchEvent) => {
      const event = convertMouseOrTouchToMouse(mouseEvent)

      if (isDragging) {
        const dx = event.clientX - initialXClick
        const dy = event.clientY - initialYClick
        _setX(initialX + dx)
        _setY(initialY + dy)
      }
      if (isResizing) {
        const dx = event.clientX - initialXClick
        const dy = event.clientY - initialYClick
        switch (isResizing) {
          case 'ne':
            _setWidth(initialWidth + dx)
            _setHeight(initialHeight - dy)
            if (initialHeight - dy >= minHeight) _setY(initialY + dy)
            break
          case 'nw':
            _setWidth(initialWidth - dx)
            _setHeight(initialHeight - dy)
            if (initialWidth - dx >= minWidth) _setX(initialX + dx)
            if (initialHeight - dy >= minHeight) _setY(initialY + dy)
            break
          case 'se':
            _setWidth(initialWidth + dx)
            _setHeight(initialHeight + dy)
            break
          case 'sw':
            _setWidth(initialWidth - dx)
            _setHeight(initialHeight + dy)
            if (initialWidth - dx >= minWidth) _setX(initialX + dx)
            break
        }
      }
    }
    addEventListener('mousemove', mouseMove)
    addEventListener('touchmove', mouseMove)
    return () => {
      removeEventListener('mousemove', mouseMove)
      removeEventListener('touchmove', mouseMove)
    }
  }, [initialHeight, initialWidth, initialX, initialXClick, initialY, initialYClick, isDragging, isResizing])

  const captureInitialCoords = (
    mouseEvent: ReactMouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | Touch
  ) => {
    setInitialX(_x)
    setInitialXClick(mouseEvent.clientX)
    setInitialWidth(_width)
    setInitialY(_y)
    setInitialYClick(mouseEvent.clientY)
    setInitialHeight(_height)
  }

  return (
    <div className={`${isDragging ? 'text-gray-900 dark:text-gray-100 grayscale-20 opacity-90' : 'text-gray-700 dark:text-gray-300'} ${isResizing ? 'text-gray-800 dark:text-gray-100 grayscale-20 opacity-90' : 'text-gray-700 dark:text-gray-300'} absolute bg-gray-600/50 rounded-xl backdrop-blur-md shadow-lg !select-none border border-gray-500/50`}
      style={{
        top: _y,
        left: _x,
        width: _width,
        height: _height,
        minHeight: minHeight,
        minWidth: minWidth,
      }}
    >
      <DragBar 
        title={title}
        windowId={windowId}
        isDragging={isDragging}
        onChangeIsDragging={(value) => setIsDragging(value)}
        mouseSelectedDrag={mouseSelectedDrag}
        onChangeMouseSelectedDrag={(value) => setMouseSelectedDrag(value)}
        touchSelectedDrag={touchSelectedDrag}
        onChangeTouchSelectedDrag={(value) => setTouchSelectedDrag(value)}
        onCaptureInitialCoords={(value) => captureInitialCoords(value)}
      />
      <ResizeButton 
        resizeDirection='ne'
        isResizing={isResizing}
        onChangeIsResizing={(value) => setIsResizing(value)}
        touchSelectedResize={touchSelectedResize}
        onChangeTouchSelectedResize={(value) => setTouchSelectedResize(value)}
        onCaptureInitialCoords={(value) => captureInitialCoords(value)}
      />
      <ResizeButton 
        resizeDirection='nw'
        isResizing={isResizing}
        onChangeIsResizing={(value) => setIsResizing(value)}
        touchSelectedResize={touchSelectedResize}
        onChangeTouchSelectedResize={(value) => setTouchSelectedResize(value)}
        onCaptureInitialCoords={(value) => captureInitialCoords(value)}
      />
      <ResizeButton 
        resizeDirection='se'
        isResizing={isResizing}
        onChangeIsResizing={(value) => setIsResizing(value)}
        touchSelectedResize={touchSelectedResize}
        onChangeTouchSelectedResize={(value) => setTouchSelectedResize(value)}
        onCaptureInitialCoords={(value) => captureInitialCoords(value)}
      />
      <ResizeButton 
        resizeDirection='sw'
        isResizing={isResizing}
        onChangeIsResizing={(value) => setIsResizing(value)}
        touchSelectedResize={touchSelectedResize}
        onChangeTouchSelectedResize={(value) => setTouchSelectedResize(value)}
        onCaptureInitialCoords={(value) => captureInitialCoords(value)}
      />
      <div className="py-1 px-2 w-full h-[calc(100%-18px)] overflow-hidden">
        {children}
      </div>
    </div>
  )
}