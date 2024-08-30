'use client'

import { useEffect, useState, MouseEvent as ReactMouseEvent, useCallback, FC, useRef } from 'react'

import { useClickAway } from 'react-use'

import { DragBar } from '@/os/apps/Window/DragBar'
import { ResizeButton } from '@/os/apps/Window/ResizeButton'
import { ScrollBarBox } from '@/os/apps/Window/ScrollBarBox'

import { type ResizeDirections } from '@/os/apps/Window/types'
import { useAppsAvailable, useAppsWindows, type AppAvail } from '@/os/apps'
import { useImmer } from 'use-immer'
import { useDebounceEffect } from 'ahooks'
import { AppWindow } from '@/os/apps/types'

import { AiOutlineFullscreen } from 'react-icons/ai'
import { BsArrowBarLeft, BsArrowBarRight, BsArrowBarUp, BsArrowBarDown } from 'react-icons/bs'

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
  uaiid: string
  userId: string
  appId: string
  instanceId: number
  title: string
  children: React.ReactNode
}

type AutoResizerPositions = 'fullscreen' | 'half-left' | 'half-right' | 'half-top' | 'half-bottom'


const locationMultiInstanceHandler = (currentApp: AppWindow) => {
  // if (currentApp.multiInstance) {
  //   return {
  //     x: currentApp.x + currentApp.zIndex * 20,
  //     y: currentApp.y + currentApp.zIndex * 20,
  //     width: currentApp.width,
  //     height: currentApp.height,
  //   }
  // } else {
  //   return {
  //     x: currentApp.x,
  //     y: currentApp.y,
  //     width: currentApp.width,
  //     height: currentApp.height,
  //   }
  // }

  return {
    x: currentApp.x,
    y: currentApp.y,
    width: currentApp.width,
    height: currentApp.height,
  }
}

export const Window: FC<WindowProps> = ({
  uaiid,
  userId,
  appId,
  instanceId,
  title,
  children, 
}) => {
  const appsWindows = useAppsWindows()
  const [currentApp, setCurrentApp] = useImmer(appsWindows.object[uaiid])
  useEffect(() => {
    setCurrentApp(appsWindows.object[uaiid])
  }, [appsWindows, setCurrentApp, uaiid])

  const openedLocation = locationMultiInstanceHandler(currentApp)

  const [_x, __setX] = useState(openedLocation.x)
  const _setX = (x: number) => __setX(clampX(x, window?.innerWidth ?? 0))
  const [_y, __setY] = useState(openedLocation.y)
  const _setY = (y: number) => __setY(clampY(y, window?.innerHeight ?? 0))
  const [_width, __setWidth] = useState(openedLocation.width)
  const _setWidth = (width: number) => __setWidth(clampWidth(width))
  const [_height, __setHeight] = useState(openedLocation.height)
  const _setHeight = (height: number) => __setHeight(clampHeight(height))

  const [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('no-select')
    } else {
      setIsHoveringAutoResizer(null)
      document.body.classList.remove('no-select')
    }
  }, [isDragging])
  const [isResizing, setIsResizing] = useState<ResizeDirections | null>(null)
  useEffect(() => {
    if (isResizing) {
      document.body.classList.add('no-select')
    } else {
      document.body.classList.remove('no-select')
    }
  }, [isResizing])
  const [isHoveringAutoResizer, setIsHoveringAutoResizer] = useState<AutoResizerPositions | null>(null)

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
      setCurrentApp((draft) => {
        draft.x = _x
        draft.y = _y
        draft.width = _width
        draft.height = _height
      })
    }
    addEventListener('mouseup', mouseUp)
    addEventListener('touchend', mouseUp)
    addEventListener('touchcancel', mouseUp)
    return () => {
      removeEventListener('mouseup', mouseUp)
      removeEventListener('touchend', mouseUp)
      removeEventListener('touchcancel', mouseUp)
    }
  }, [_height, _width, _x, _y, setCurrentApp])

  useDebounceEffect(() => {
    appsWindows.relocate(uaiid, {
      x: currentApp.x,
      y: currentApp.y,
      width: currentApp.width,
      height: currentApp.height,
    })
  }, [currentApp, uaiid], { wait: 250 })

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


  const handleAutoResizerMouseEnter = (position: AutoResizerPositions) => {
    setIsHoveringAutoResizer(position)
  }

  const handleAutoResizerMouseUp = (position: AutoResizerPositions) => {
    switch (position) {
      case 'fullscreen':
        _setX(0)
        _setY(0)
        _setWidth(window.innerWidth)
        _setHeight(window.innerHeight)
        break
      case 'half-left':
        _setX(0)
        _setY(0)
        _setWidth(window.innerWidth / 2)
        _setHeight(window.innerHeight)
        break
      case 'half-right':
        _setX(window.innerWidth / 2)
        _setY(0)
        _setWidth(window.innerWidth / 2)
        _setHeight(window.innerHeight)
        break
      case 'half-top':
        _setX(0)
        _setY(0)
        _setWidth(window.innerWidth)
        _setHeight(window.innerHeight / 2)
        break
      case 'half-bottom':
        _setX(0)
        _setY(window.innerHeight / 2)
        _setWidth(window.innerWidth)
        _setHeight(window.innerHeight / 2)
        break
    }
  }

  return (
    <>
      <div className={`absolute top-0 transition-all duration-300 left-0 z-4000 w-full ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
        {
          isDragging && (
            <div className='flex w-full h-5 justify-evenly items-center'>
              <div className={`${baseAutoResizerClass} ${isHoveringAutoResizer === 'half-left' ? 'opacity-100 shadow-xl drop-shadow-glow' : 'opacity-50 shadow'}`}
                onMouseEnter={() => handleAutoResizerMouseEnter('half-left')}
                onMouseUp={() => handleAutoResizerMouseUp('half-left')}
                onMouseLeave={() => setIsHoveringAutoResizer(null)}
              >
                <BsArrowBarLeft />
              </div>
              <div className={`${baseAutoResizerClass} ${isHoveringAutoResizer === 'fullscreen' ? 'opacity-100 shadow-xl drop-shadow-glow' : 'opacity-50 shadow'}`}
                onMouseEnter={() => handleAutoResizerMouseEnter('fullscreen')}
                onMouseUp={() => handleAutoResizerMouseUp('fullscreen')}
                onMouseLeave={() => setIsHoveringAutoResizer(null)}
              >
                <AiOutlineFullscreen />
              </div>
              <div className={`${baseAutoResizerClass} ${isHoveringAutoResizer === 'half-right' ? 'opacity-100 shadow-xl drop-shadow-glow' : 'opacity-50 shadow'}`}
                onMouseEnter={() => handleAutoResizerMouseEnter('half-right')}
                onMouseUp={() => handleAutoResizerMouseUp('half-right')}
                onMouseLeave={() => setIsHoveringAutoResizer(null)}
              >
                <BsArrowBarRight />
              </div>
            </div>
          )
        }
      </div>
    
      <div className={`${isDragging ? 'text-gray-900 dark:text-gray-100 grayscale-20 opacity-90' : 'text-gray-700 dark:text-gray-300'} ${isResizing ? 'text-gray-800 dark:text-gray-100 grayscale-20 opacity-90' : 'text-gray-700 dark:text-gray-300'} absolute bg-gray-400/30 dark:bg-gray-600/30 rounded-xl backdrop-blur-xl shadow-lg !select-none border border-gray-500/50`}
        style={{
          top: _y,
          left: _x,
          width: _width,
          height: _height,
          minHeight: minHeight,
          minWidth: minWidth,
          zIndex: currentApp.zIndex + 1000,
        }}
        onMouseDown={() => {
          appsWindows.focus(uaiid)
        }}
      >
        <DragBar 
          title={title}
          uaiid={uaiid}
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
        <div className="w-full h-[calc(100%-19px)] overflow-hidden">
          <ScrollBarBox>
            {children}
          </ScrollBarBox>
        </div>
      </div>
    </>
  )
}


const baseAutoResizerClass = 'text-gray-800 dark:text-gray-100 w-8 h-full flex justify-center items-start bg-gray-400/30 dark:bg-gray-600/30 rounded-b-xl backdrop-blur-xl !select-none border border-gray-500/50 cursor-move'