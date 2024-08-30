'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useClickAway, useWindowSize } from 'react-use'
import { useMousePosition } from '@/hooks/useMousePosition'

import { BiWindows, BiDotsVertical } from 'react-icons/bi'
import { MdMenuOpen } from 'react-icons/md'
import { IoIosApps } from 'react-icons/io'
import { RiSettings3Line, RiAccountBoxLine } from 'react-icons/ri'
import { flushSync } from 'react-dom'

import { useAppsAvailable, useAppsRunning, useAppsWindows } from '@/os/apps'
import { ControllerButton } from '@/os/controller/Controller/ControllerButton'
import { Menu, MenuItem } from '@/os/controller/Controller/Menu'
import { ControllerBiLocation, ControllerOptions } from '@/os/controller/Controller/types'
import { useSystem } from '@/os/system'

let timeInControllerHitbox = 0

type ControllerProps = {
  focused: boolean
  onChangeFocused: (focused: boolean) => void

  location: ControllerOptions['location']
  onChangeLocation: (location: ControllerOptions['location']) => void
  theme: ControllerOptions['theme']
  onToggleTheme: () => void

  width: number
  height: number
}

export const Controller: FC<ControllerProps> = ({
  focused: controllerFocused,
  onChangeFocused: onChangeControllerFocused,

  location,
  onChangeLocation,
  theme,
  onToggleTheme,

  width,
  height,
}) => {
  const system = useSystem()
  const appsAvailable = useAppsAvailable()
  const appsWindows = useAppsWindows()
  const appsRunning = useAppsRunning()
  const { x, y } = useMousePosition()
  
  const [mouseInControlHandle, setMouseInControlHandle] = useState(false)
  const [mouseInController, setMouseInController] = useState(false)
  const [mouseInMenu, setMouseInMenu] = useState(false)

  const [shouldTransition, setShouldTransition] = useState(false)
  
  const [selectedChangeLocation, setSelectedChangeLocation] = useState(false)

  const [menuDirection, setMenuDirection] = 
    useState<ControllerBiLocation | null>(null)
  const [menuSelected, setMenuSelected] = 
    useState<keyof typeof menuItems>('none')

  const clickAwayRef = useRef(null)
  useClickAway(clickAwayRef, () => {
    if (controllerFocused && (
      location === 'top' && y > 52 ||
      location === 'bottom' && y < height - 52 ||
      location === 'left' && x > 52 ||
      location === 'right' && x < width - 52
    )) {
      setTimeout(() => { closeController() }, 200)
    }
  }, ['onClick', 'onMouseDown', 'onMouseOver', 'onMouseOut', 'onTouchStart', 'onTouchEnd', 'onTouchMove']) // overkill?

  const defaultSettingsMenu = [{
    icon: '',
    title: theme === 'dark' ? 'Change To Light Theme' : 'Change To Dark Theme',
    menuId: 'light-dark-theme',
    onClick: () => {
      onToggleTheme()
    },
  },{
    icon: '',
    title: 'Control Bar Location',
    menuId: 'control-bar-location',
    onClick: () => {
      setSelectedChangeLocation(true)
    },
  }]

  const changeLocationSettingsMenu = [{
    icon: '',
    title: 'Top',
    menuId: 'top',
    onClick: () => {
      flushSync(() => {
        closeController()
        setShouldTransition(false)
      })
      onChangeLocation('top')
      setSelectedChangeLocation(false)
    },
  },{
    icon: '',
    title: 'Bottom',
    menuId: 'bottom',
    onClick: () => {
      flushSync(() => {
        closeController()
        setShouldTransition(false)
      })
      onChangeLocation('bottom')
      setSelectedChangeLocation(false)
    },
  },{
    icon: '',
    title: 'Left',
    menuId: 'left',
    onClick: () => {
      flushSync(() => {
        closeController()
        setShouldTransition(false)
      })
      onChangeLocation('left')
      setSelectedChangeLocation(false)
    },
  },{
    icon: '',
    title: 'Right',
    menuId: 'right',
    onClick: () => {
      flushSync(() => {
        closeController()
        setShouldTransition(false)
      })
      onChangeLocation('right')
      setSelectedChangeLocation(false)
    },
  }].filter((item) => item.menuId !== location)

  const menuItems: Record<string, MenuItem[]> = {
    none: [],
    focusedApp: [{
      icon: '',
      title: 'New',
      menuId: 'new',
      onClick: () => {
        alert('Not implemented')
      },
    }, {
      icon: '',
      title: 'Open',
      menuId: 'open',
      onClick: () => {
        alert('Not implemented')
      },
    }, {
      icon: '',
      title: 'Save',
      menuId: 'save',
      onClick: () => {
        alert('Not implemented')
      },
    },{
      icon: '',
      title: 'Save as...',
      menuId: 'saveAs',
      onClick: () => {
        alert('Not implemented')
      },
    }, {
      icon: '',
      title: 'Close',
      menuId: 'close',
      onClick: () => {
        alert('Not implemented')
      },
    }],
    account: [{
      icon: '',
      title: `Log Out - ${system.data.user.userId}`,
      menuId: 'log-out',
      onClick: () => {
        system.logout()
      },
    },{
      icon: '',
      title: 'Profile',
      menuId: 'profile',
      onClick: () => {
        system.login({ userId: 'DavidP', name: 'David' })
      },
    }],
    settings: (
      selectedChangeLocation ? 
        changeLocationSettingsMenu 
        : 
        defaultSettingsMenu
    ),
    apps: appsAvailable.array.map((app) => ({
      icon: '',
      title: app.title,
      menuId: app.appId,
      onClick: () => {
        appsRunning.open({
          appId: app.appId,
          title: app.title,
          multiInstance: app.multiInstance,
        })
      },
    })),
    windows: appsRunning.array.map((app) => ({
      icon: '',
      title: `${app.appId}-${app.instanceId}`,
      menuId: `${app.appId}-${app.instanceId}`,
      onClick: () => {
        const uaiid = `${system.data.user.userId}-${app.appId}-${app.instanceId}`
        appsWindows.focus(uaiid)
      }
    }))
  }

  useEffect(() => {
    setShouldTransition(true)
  }, [location])

  const closeController = useCallback(() => {
    timeInControllerHitbox = 0
    onChangeControllerFocused(false)
    setMouseInControlHandle(false)
    setMouseInController(false)
    setMouseInMenu(false)
    setMenuDirection(null)
    setSelectedChangeLocation(false)
  }, [onChangeControllerFocused])

  const controlButtonClicked = () => {
    setMouseInController(true)
    onChangeControllerFocused(true)
  }

  const handleControllerFocused = useCallback((
    relativeMousePosition: number,
    _mouseInside: boolean,
  ) => {
    if (!controllerFocused) {
      if (_mouseInside) {
        timeInControllerHitbox = 5
        onChangeControllerFocused(true)
      } else if ((relativeMousePosition >= 0 && relativeMousePosition < 10)) {
        if (timeInControllerHitbox > 5) onChangeControllerFocused(true)
        else timeInControllerHitbox++
      } else {
        closeController()
      }
    } else {
      if ((relativeMousePosition >= 0 && relativeMousePosition < 52) || _mouseInside) {
        if (timeInControllerHitbox > 5) onChangeControllerFocused(true)
        else timeInControllerHitbox++
      } else {
        closeController()
      }
    }
  }, [closeController, controllerFocused, onChangeControllerFocused])

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
            <ControllerButton 
              Icon={RiAccountBoxLine} controllerFocused={controllerFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('top-left')
                setMenuSelected('account')
              }}
            />
            <ControllerButton 
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
            <ControllerButton 
              Icon={MdMenuOpen} controllerFocused={controllerFocused}
              onClick={() => {
                controlButtonClicked()
                setMenuDirection('bottom-right')
                // this will be the app specific menu
                // when an app gets focused, it's options will be added to menuItems.focusedApp
                // bottom should always be "Close"
                setMenuSelected('focusedApp')
              }}
            />
            <ControllerButton 
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
            (location === 'top' || location === 'bottom') ?
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

          onChangeControllerFocused(true)
        }}
      >
        {
          controllerFocused ? 
            <BiWindows 
              className={'dark:text-white text-black drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]'} size={24}
            /> : 
            <BiDotsVertical 
              className={'dark:text-white text-black drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]'} size={24}
            />
        }
      </div>
      <Menu 
        direction={menuDirection}
        controllerLocation={location}
        menuSelected={menuSelected}
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