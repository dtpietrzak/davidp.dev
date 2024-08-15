"use client"

import { FC, useCallback, useEffect, useState } from "react"
import { useMousePosition } from "@/hooks/useMouseLocation"
import { useWindowSize } from "@/hooks/useWindowSize"
import { useClickAway } from "@/hooks/useClickAway"

import { BiWindows, BiDotsVertical } from "react-icons/bi"
import { IoIosApps } from "react-icons/io"
import { PiFilesDuotone } from "react-icons/pi"
import { RiSettings3Line, RiAccountBoxLine } from "react-icons/ri"
import { IconType } from "react-icons"
import { flushSync } from "react-dom"

import { useToolTip } from "@/components/ToolTip"
import { renderGenericWindow, useWindows } from "@/os/windows"

let timeInControllerHitbox = 0

type VerticalLocation = 'top' | 'bottom'
type HorizontalLocation = 'left' | 'right'

type BiLocation = 'top-left' | 'bottom-right'

type Location = VerticalLocation | HorizontalLocation

type ControllerOptions = {
  location: Location
}

const locationsArray: ControllerOptions['location'][] = ['right', 'left', 'top', 'bottom']

export const Controller = () => {
  const { x, y } = useMousePosition()
  const { openToolTip, closeToolTip } = useToolTip()
  const { width, height } = useWindowSize()
  
  const [mouseInControlHandle, setMouseInControlHandle] = useState(false)
  const [mouseInController, setMouseInController] = useState(false)
  const [mouseInMenu, setMouseInMenu] = useState(false)

  const [controllerFocused, setControllerFocused] = useState(false)
  const [shouldTransition, setShouldTransition] = useState(false)
  const [temp, setTemp] = useState(0)
  const [location, setLocation] = 
    useState<ControllerOptions['location']>(locationsArray[temp])

  const [menuDirection, setMenuDirection] = useState<BiLocation | null>(null)
  const [menuSelected, setMenuSelected] = 
    useState<keyof typeof menuItems>('none')

  const windows = useWindows()

  const [osData, setOsData] = useState({
    userId: 'guest',
  })

  const clickAwayRef = useClickAway(() => {
    if (controllerFocused && (
      location === 'top' && y > 52 ||
        location === 'bottom' && y < height - 52 ||
        location === 'left' && x > 52 ||
        location === 'right' && x < width - 52
    )) {
      setTimeout(() => { closeController() }, 200)
    }
  })

  const menuItems: Record<string, MenuItem[]> = {
    none: [],
    settings: [{
      graphicIcon: '',
      label: 'Light / Dark Theme',
      onClick: () => {
        const theme = localStorage.getItem('theme')
        if (theme) {
          if (theme === 'dark') {
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark')
            document.body.style.setProperty('background', '#FFF')
          } else {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark')
            document.body.style.setProperty('background', '#000')
          }
        } else {
          document.documentElement.classList.remove('dark')
          document.body.style.setProperty('background', '#FFF')
        }
      },
    },{
      graphicIcon: '',
      label: 'Control Bar Location',
      onClick: () => {
        flushSync(() => {
          closeController()
          setShouldTransition(false)
        })
        setTemp((prev) => {
          return prev === 3 ? 0 : (prev + 1)
        })
        setLocation(locationsArray[temp])
      },
    }],
    account: [{
      graphicIcon: '',
      label: 'Log Out',
      onClick: () => {},
    },{
      graphicIcon: '',
      label: 'Profile',
      onClick: () => {},
    }],
    apps: [{
      graphicIcon: '',
      label: 'Node-ish',
      onClick: () => {},
    },{
      graphicIcon: '',
      label: 'App Builder',
      onClick: () => {},
    },{
      graphicIcon: '',
      label: 'Web Browser',
      onClick: () => {
        renderGenericWindow('Web Browser', 'web-browser', <>web stuff</>)
      },
    },{
      graphicIcon: '',
      label: 'Text Editor',
      onClick: () => {
        renderGenericWindow('Text Editor', 'text-editor', <></>)
      },
    },{
      graphicIcon: '',
      label: 'Weather',
      onClick: () => {},
    },{
      graphicIcon: '',
      label: 'System Information',
      onClick: () => {},
    }],
    windows: [{
      graphicIcon: '',
      label: 'Node-ish',
      onClick: () => {},
    },{
      graphicIcon: '',
      label: 'Web Browser',
      onClick: () => {},
    },{
      graphicIcon: '',
      label: 'Text Editor',
      onClick: () => {},
    }],
  }

  useEffect(() => {
    setShouldTransition(true)
  }, [location])

  const closeController = useCallback(() => {
    timeInControllerHitbox = 0
    setControllerFocused(false)
    setMouseInControlHandle(false)
    setMouseInController(false)
    setMouseInMenu(false)
    setMenuDirection(null)
  }, [])

  const controlButtonClicked = () => {
    setMouseInController(true)
    setControllerFocused(true)
  }

  const handleControllerFocused = useCallback((
    relativeMousePosition: number,
    _mouseInside: boolean,
  ) => {
    if (!controllerFocused) {
      if (_mouseInside) {
        timeInControllerHitbox = 5
        setControllerFocused(true)
      } else if ((relativeMousePosition >= 0 && relativeMousePosition < 10)) {
        if (timeInControllerHitbox > 5) setControllerFocused(true)
        else timeInControllerHitbox++
      } else {
        closeController()
      }
    } else {
      if ((relativeMousePosition >= 0 && relativeMousePosition < 52) || _mouseInside) {
        if (timeInControllerHitbox > 5) setControllerFocused(true)
        else timeInControllerHitbox++
      } else {
        closeController()
      }
    }
  }, [closeController, controllerFocused])

  const logicClockCallback = useCallback(() => {
    const mouseInside = mouseInControlHandle || mouseInController || mouseInMenu

    switch (location) {
      case 'top':
        handleControllerFocused(y, mouseInside)
        break
      case 'bottom':
        handleControllerFocused(height - y, mouseInside)
        break
      case 'left':
        handleControllerFocused(x, mouseInside)
        break
      case 'right':
        handleControllerFocused(width - x, mouseInside)
        break
    }
    
  }, [handleControllerFocused, mouseInControlHandle, mouseInController, mouseInMenu, height, location, width, x, y])

  useEffect(() => {
    const intervalId = setInterval(logicClockCallback, 33)
    return () => clearInterval(intervalId)
  }, [logicClockCallback])

  useEffect(() => {
    const handleResize = () => {
      if (shouldTransition) setShouldTransition(false)
      if (controllerFocused) closeController()
      setTimeout(() => {
        setShouldTransition(true)
      }, 500)
    }
    addEventListener('resize', handleResize)
    return () => removeEventListener('resize', handleResize)
  }, [closeController, controllerFocused, shouldTransition])

  return (
    <>
      <div 
        ref={clickAwayRef}
        className={
          `z-3000 overflow-hidden fixed ease-out select-none backdrop-blur-md border-gray-500/50 ${shouldTransition ? 'transition-all' : ''} ${ 
            controllerFocused ? 'shadow-[0px_0px_12px_4px_rgb(0,0,0,0.1)] bg-gray-400/30 dark:bg-gray-600/30' : 'shadow-[inset_2px_-1px_4px_rgb(0,0,0,0.05)] bg-gray-300/10 dark:bg-gray-700/10'
          } ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `w-full ${ controllerFocused ? 'h-[52px]' : 'h-[11px]' }` : 
            // left or right
              `safe-h-full ${ controllerFocused ? 'w-[52px]' : 'w-[11px]' }` 
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
          setMouseInController(true)
        }}
        onMouseLeave={() => {
          setMouseInController(false)
        }}
        onClick={() => {
          setMouseInController(true)
        }}
      >
        <div 
          className={`flex w-full h-full justify-between items-center ${
            location === 'top' || location === 'bottom' ? 'flex-row' : 'flex-col'
          } ${ controllerFocused ? 'opacity-100' : 'opacity-50' }`}
        >
          <div className={`${
            location === 'top' || location === 'bottom' ? 'flex' : 'flex-col'
          }`}>
            <IconButton 
              Icon={RiAccountBoxLine} controllerFocused={controllerFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('top-left')
                setMenuSelected('account')
              }}
            />
            <IconButton 
              Icon={RiSettings3Line} controllerFocused={controllerFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('top-left')
                setMenuSelected('settings')
              }}
            />
          </div>
          <div className={`${
            location === 'top' || location === 'bottom' ? 'flex flex-row' : 'flex flex-col'
          }`}>
            <IconButton 
              Icon={PiFilesDuotone} controllerFocused={controllerFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection(null)
                setMenuSelected('none')
                windows.openWindow('file_explorer', osData)
              }}
            />
            <IconButton 
              Icon={IoIosApps} controllerFocused={controllerFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('bottom-right')
                setMenuSelected('apps')
              }}
            />
            <div className="h-[52px] w-[52px]" />
          </div>
        </div>
      </div>

      <div
        className={
          `z-4000 transition-all duration-300 fixed border hover:bg-gray-100/60 dark:hover:bg-gray-500/60 backdrop-blur-md flex justify-center items-center cursor-pointer ${controllerFocused ? 'border-transparent bg-transparent m-0' : 'border-gray-500/50 bg-gray-200/30 dark:bg-gray-600/40 shadow-md m-[2px]'} ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `${controllerFocused ? 'w-[52px]' : 'w-[44px]'}` : 
            // left or right
              `${controllerFocused ? 'h-[52px]' : 'h-[44px]'}` 
          } ${
            location === 'top' ? `top-0 right-0 ${controllerFocused ? 'rounded-none h-[51px]' : 'rounded-[22px] h-[44px]'}` : ''
          }${
            location === 'bottom' ? `safe-bottom right-0 ${controllerFocused ? 'rounded-none h-[51px]' : 'rounded-[22px] h-[44px]'}` : ''
          }${
            location === 'left' ? `left-0 safe-bottom ${controllerFocused ? 'rounded-none w-[51px]' : 'rounded-[22px] w-[44px]'}` : ''
          }${
            location === 'right' ? `right-0 safe-bottom ${controllerFocused ? 'rounded-none w-[51px]' : 'rounded-[22px] w-[44px]'}` : ''
          }`
        }
        onMouseEnter={() => {
          setMouseInControlHandle(true)
        }}
        onMouseLeave={() => {
          setMouseInControlHandle(false)
        }}
        onClick={() => {
          if (controllerFocused) {
            controlButtonClicked()
            setMenuDirection('bottom-right')
            setMenuSelected('windows')
          }

          setControllerFocused(true)
        }}
      >
        {
          controllerFocused ? 
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
        controllerLocation={location}
        items={menuItems[menuSelected]}
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
  controllerFocused: boolean
  onClick: () => void
  size?: number
}

const IconButton: FC<IconButtonProps> = ({
  Icon,
  controllerFocused,
  onClick,
  size,
}) => {
  const iconSize = () => (controllerFocused ? 24 : 12)
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
  controllerLocation: ControllerOptions['location']
  items: MenuItem[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Menu: FC<MenuProps> = ({
  direction,
  controllerLocation,
  items,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!direction) return null

  return (
    <div 
      className={`flex flex-col font-sm dark:text-white text-black py-1.5 pl-1.5 pr-1 fixed z-2000 h-fit max-h-full min-w-[240px] max-w-[480px] bg-gray-400/30 dark:bg-gray-600/30 backdrop-blur-md shadow-md overflow-scroll scrollbar-hide ${
        controllerLocation === 'top' ? 'top-[52px] rounded-b-2xl' : ''
      } ${
        controllerLocation === 'bottom' ? 'safe-bottom-minus-bar rounded-t-2xl' : ''
      } ${
        controllerLocation === 'left' ? 'left-[52px] rounded-r-2xl' : ''
      } ${
        controllerLocation === 'right' ? 'right-[52px] rounded-l-2xl' : ''
      } ${
        (
          (controllerLocation === 'top' || controllerLocation === 'bottom') &&
          direction === 'top-left'
        ) ? 'left-0' : ''
      } ${
        (
          (controllerLocation === 'top' || controllerLocation === 'bottom') &&
          direction === 'bottom-right'
        ) ? 'right-0' : ''
      } ${
        (
          (controllerLocation === 'left' || controllerLocation === 'right') &&
          direction === 'top-left'
        ) ? 'top-0' : ''
      } ${
        (
          (controllerLocation === 'left' || controllerLocation === 'right') &&
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
                    <div className="bg-gray-500/20 dark:bg-gray-500/20 w-[calc(100%-24px)] h-[1px]" />
                  </div> :
                  <></>
              }
              <button
                className={`flex font-sm !text-[0.9em] items-center justify-start w-full py-2 px-4 hover:bg-gray-100/60 dark:hover:bg-gray-500/60 cursor-pointer rounded-xl my-[2px] shadow-none hover:shadow`}
                onClick={() => {
                  item.onClick()
                }}
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