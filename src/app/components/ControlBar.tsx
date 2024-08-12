"use client"

import { useMousePosition } from "@/hooks/useMouseLocation"
import { useToolTip } from "@/hooks/useToolTip"
import { useWindowSize } from "@/hooks/useWindowSize"
import { useClickAway } from "@/hooks/useClickAway"
import { FC, useCallback, useEffect, useState } from "react"

import { BiWindows, BiDotsVertical } from "react-icons/bi"
import { IoIosApps } from "react-icons/io"
import { PiFilesDuotone } from "react-icons/pi"
import { RiSettings3Line, RiAccountBoxLine } from "react-icons/ri"
import { IconType } from "react-icons"

let timeInControlBarHitbox = 0

type VerticalLocation = 'top' | 'bottom'
type HorizontalLocation = 'left' | 'right'

type BiLocation = 'top-left' | 'bottom-right'

type Location = VerticalLocation | HorizontalLocation

type ControlBarOptions = {
  location: Location
}

const locationsArray: ControlBarOptions['location'][] = ['right', 'left', 'top', 'bottom']

export const ControlBar = () => {
  const { x, y } = useMousePosition()
  const { openToolTip, closeToolTip } = useToolTip()
  const { width, height } = useWindowSize()
  
  const [mouseInControlHandle, setMouseInControlHandle] = useState(false)
  const [mouseInControlBar, setMouseInControlBar] = useState(false)
  const [mouseInMenu, setMouseInMenu] = useState(false)

  const [controlBarFocused, setControlBarFocused] = useState(false)
  const [temp, setTemp] = useState(0)
  const [location, setLocation] = 
  useState<ControlBarOptions['location']>(locationsArray[temp])
  const [menuDirection, setMenuDirection] = useState<BiLocation | null>(null)

  const closeControlBar = useCallback(() => {
    timeInControlBarHitbox = 0
    setControlBarFocused(false)
    setMouseInControlHandle(false)
    setMouseInControlBar(false)
    setMouseInMenu(false)
    setMenuDirection(null)
  }, [])

  const controlButtonClicked = () => {
    setMouseInControlBar(true)
    setControlBarFocused(true)
  }
  
  const clickAwayRef = useClickAway(() => {
    if (controlBarFocused && (
      location === 'top' && y > 52 ||
      location === 'bottom' && y < height - 52 ||
      location === 'left' && x > 52 ||
      location === 'right' && x < width - 52
    )) {
      closeControlBar()
    }
  })

  const handleControlBarFocused = useCallback((
    relativeMousePosition: number,
    _mouseInside: boolean,
  ) => {
    if (!controlBarFocused) {
      if (_mouseInside) {
        timeInControlBarHitbox = 5
        setControlBarFocused(true)
      } else if ((relativeMousePosition >= 0 && relativeMousePosition < 10)) {
        if (timeInControlBarHitbox > 5) setControlBarFocused(true)
        else timeInControlBarHitbox++
      } else {
        closeControlBar()
      }
    } else {
      if ((relativeMousePosition >= 0 && relativeMousePosition < 52) || _mouseInside) {
        if (timeInControlBarHitbox > 5) setControlBarFocused(true)
        else timeInControlBarHitbox++
      } else {
        closeControlBar()
      }
    }
  }, [closeControlBar, controlBarFocused])

  const logicClockCallback = useCallback(() => {
    const mouseInside = mouseInControlHandle || mouseInControlBar || mouseInMenu

    switch (location) {
      case 'top':
        handleControlBarFocused(y, mouseInside)
        break
      case 'bottom':
        handleControlBarFocused(height - y, mouseInside)
        break
      case 'left':
        handleControlBarFocused(x, mouseInside)
        break
      case 'right':
        handleControlBarFocused(width - x, mouseInside)
        break
    }
    
  }, [handleControlBarFocused, mouseInControlHandle, mouseInControlBar, mouseInMenu, height, location, width, x, y])

  useEffect(() => {
    const intervalId = setInterval(logicClockCallback, 33)
    return () => clearInterval(intervalId)
  }, [logicClockCallback])

  return (
    <>
      <div 
        ref={clickAwayRef}
        className={
          `z-30 overflow-hidden fixed transition-all ease-out backdrop-blur-xl border-gray-500/50 ${ 
            controlBarFocused ? 'shadow-[0px_0px_12px_4px_rgb(0,0,0,0.1)] bg-gray-400/30 dark:bg-gray-600/30' : 'shadow-[inset_2px_-1px_4px_rgb(0,0,0,0.05)] bg-gray-300/10 dark:bg-gray-700/10'
          } ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `w-full ${ controlBarFocused ? 'h-[52px]' : 'h-[11px]' }` : 
            // left or right
              `safe-h-full ${ controlBarFocused ? 'w-[52px]' : 'w-[11px]' }` 
          } ${
            location === 'top' ? 'border-b top-0' : ''
          }${
            location === 'bottom' ? 'border-t safe-bottom' : ''
          }${
            location === 'left' ? 'border-r left-0' : ''
          }${
            location === 'right' ? 'border-l right-0' : ''
          }`
        }
        onMouseEnter={() => {
          setMouseInControlBar(true)
        }}
        onMouseLeave={() => {
          setMouseInControlBar(false)
        }}
        onClick={() => {
          setMouseInControlBar(true)
        }}
      >
        <div 
          className={`flex w-full h-full justify-between items-center ${
            location === 'top' || location === 'bottom' ? 'flex-row' : 'flex-col'
          } ${ controlBarFocused ? 'opacity-100' : 'opacity-50' }`}
        >
          <div className={`${
            location === 'top' || location === 'bottom' ? 'flex' : 'flex-col'
          }`}>
            <IconButton 
              Icon={RiSettings3Line} controlBarFocused={controlBarFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('top-left')
                setTemp((prev) => {
                  return prev === 3 ? 0 : (prev + 1)
                })
                setLocation(locationsArray[temp])
              }}
            />
            <IconButton 
              Icon={RiAccountBoxLine} controlBarFocused={controlBarFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('top-left')
              }}
            />
          </div>
          <div className={`${
            location === 'top' || location === 'bottom' ? 'flex flex-row' : 'flex flex-col'
          }`}>
            <IconButton 
              Icon={PiFilesDuotone} controlBarFocused={controlBarFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('bottom-right')
              }}
            />
            <IconButton 
              Icon={IoIosApps} controlBarFocused={controlBarFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('bottom-right')
              }}
            />
            <div className="h-[52px] w-[52px]" />
          </div>
        </div>
      </div>

      <div
        className={
          `z-40 transition-all duration-300 fixed border hover:bg-gray-100/60 dark:hover:bg-gray-500/60 backdrop-blur-xl flex justify-center items-center cursor-pointer ${controlBarFocused ? 'border-transparent bg-transparent m-0' : 'border-gray-500/50 bg-gray-200/30 dark:bg-gray-600/40 shadow-md m-[2px]'} ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `${controlBarFocused ? 'w-[52px]' : 'w-[44px]'}` : 
            // left or right
              `${controlBarFocused ? 'h-[52px]' : 'h-[44px]'}` 
          } ${
            location === 'top' ? `top-0 right-0 ${controlBarFocused ? 'rounded-none h-[51px]' : 'rounded-[22px] h-[44px]'}` : ''
          }${
            location === 'bottom' ? `safe-bottom right-0 ${controlBarFocused ? 'rounded-none h-[51px]' : 'rounded-[22px] h-[44px]'}` : ''
          }${
            location === 'left' ? `left-0 safe-bottom ${controlBarFocused ? 'rounded-none w-[51px]' : 'rounded-[22px] w-[44px]'}` : ''
          }${
            location === 'right' ? `right-0 safe-bottom ${controlBarFocused ? 'rounded-none w-[51px]' : 'rounded-[22px] w-[44px]'}` : ''
          }`
        }
        onMouseEnter={() => {
          setMouseInControlHandle(true)
        }}
        onMouseLeave={() => {
          setMouseInControlHandle(false)
        }}
        onClick={() => {
          if (controlBarFocused) {
            controlButtonClicked()
            setMenuDirection('bottom-right')
          }

          setControlBarFocused(true)
        }}
      >
        {
          controlBarFocused ? 
            <BiWindows 
              className={`dark:text-white text-black drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={24}
            /> : 
            <BiDotsVertical 
              className={`dark:text-white text-black drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={24}
            />
        }
      </div>
      <Menu 
        direction={menuDirection}
        controlBarLocation={location}
        items={[{
          graphicIcon: '',
          label: 'node-ish',
          onClick: () => {},
        },{
          graphicIcon: '',
          label: 'app builder',
          onClick: () => {},
        },{
          graphicIcon: '',
          label: 'text editor',
          onClick: () => {},
        },{
          graphicIcon: '',
          label: 'web browser',
          onClick: () => {},
        }]}
        onMouseEnter={() => {
          setMouseInMenu(true)
        }}
        onMouseLeave={() => {
          setMouseInMenu(false)
        }}
      />
    </>
  )
}

type IconButtonProps = {
  Icon: IconType
  controlBarFocused: boolean
  onClick: () => void
  size?: number
}

const IconButton: FC<IconButtonProps> = ({
  Icon,
  controlBarFocused,
  onClick,
  size,
}) => {
  const iconSize = () => (controlBarFocused ? 24 : 12)
  const iconColor = () => `dark:text-white text-black`

  return (
    <button className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-500/60" onClick={onClick}>
      <Icon
        className={`${iconColor()} drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={size ?? iconSize()}
      />
    </button>
  )
}

type MenuItem = {
  graphicIcon: string
  label: string
  onClick: () => void
}

type MenuProps = {
  direction: BiLocation | null
  controlBarLocation: ControlBarOptions['location']
  items: MenuItem[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Menu: FC<MenuProps> = ({
  direction,
  controlBarLocation,
  items,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!direction) return null

  return (
    <div 
      className={`flex flex-col text-sm dark:text-white text-black py-2 px-2 fixed z-20 h-fit max-h-full min-w-[240px] max-w-[480px] bg-gray-400/30 dark:bg-gray-600/30 backdrop-blur-xl shadow-md ${
        controlBarLocation === 'top' ? 'top-[52px] rounded-b-xl' : ''
      } ${
        controlBarLocation === 'bottom' ? 'safe-bottom-minus-bar rounded-t-xl' : ''
      } ${
        controlBarLocation === 'left' ? 'left-[52px] rounded-r-xl' : ''
      } ${
        controlBarLocation === 'right' ? 'right-[52px] rounded-l-xl' : ''
      } ${
        (
          (controlBarLocation === 'top' || controlBarLocation === 'bottom') &&
          direction === 'top-left'
        ) ? 'left-0' : ''
      } ${
        (
          (controlBarLocation === 'top' || controlBarLocation === 'bottom') &&
          direction === 'bottom-right'
        ) ? 'right-0' : ''
      } ${
        (
          (controlBarLocation === 'left' || controlBarLocation === 'right') &&
          direction === 'top-left'
        ) ? 'top-0' : ''
      } ${
        (
          (controlBarLocation === 'left' || controlBarLocation === 'right') &&
          direction === 'bottom-right'
        ) ? 'safe-bottom' : ''
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {
        items.map((item, index) => {
          return (
            <div
              key={item.label}
            >
              {
                index !== 0 ?
                  <div className="w-full flex justify-center items-center">
                    <div className="bg-gray-500/50 dark:bg-gray-500/50 w-[calc(100%-20px)] h-[1px]" />
                  </div> :
                  <></>
              }
              <button
                className={`flex items-center justify-start w-full py-2 px-4 hover:bg-gray-100/60 dark:hover:bg-gray-500/60 cursor-pointer rounded-lg my-[2px]`}
              >
                {item.label}
              </button>
            </div>
          )
        })
      }
    </div>
  )
}