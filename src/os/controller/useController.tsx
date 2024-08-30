'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { Controller } from '@/os/controller/Controller'
import { ControllerOptions } from '@/os/controller/Controller/types'
import { useWindowSize } from 'react-use'

const ControllerContext = createContext({
  
})

type ControllerProviderProps = {
  children: React.ReactNode
}

const barSmall = 10
const barLarge = 52

export const ControllerProvider = ({ children }: ControllerProviderProps) => {
  const { width, height } = useWindowSize() // html window, not our "app window"

  const [controllerFocused, setControllerFocused] = useState(false)
  const [location, setLocation] = 
    useState<ControllerOptions['location']>('right')
  const [theme, setTheme] = useState<ControllerOptions['theme']>('dark')

  const toggleTheme = () => {
    const theme = localStorage.getItem('theme')
    if (theme) {
      if (theme === 'dark') {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
        document.body.style.setProperty('background', '#FFF')
        setTheme('light')
      } else {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
        document.body.style.setProperty('background', '#000')
        setTheme('dark')
      }
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
      document.body.style.setProperty('background', '#000')
      setTheme('dark')
    }
  }

  const size = useMemo(() => {
    const windowIsVertical = height > width
    const windowIsHorizontal = width > height
    const controllerIsVertical = location === 'left' || location === 'right'
    const controllerIsHorizontal = location === 'top' || location === 'bottom'
    const barSize = controllerFocused ? barLarge : barSmall

    return {
      sliding: {
        width: width - (controllerIsVertical ? barSize : 0),
        height: height - (controllerIsHorizontal ? barSize : 0),
        x: location === 'left' ? barSize : 0,
        y: location === 'top' ? barSize : 0,
      },
      max: {
        width: width - (controllerIsVertical ? barSmall : 0),
        height: height - (controllerIsHorizontal ? barSmall : 0),
        x: location === 'left' ? barSmall : 0,
        y: location === 'top' ? barSmall : 0,
      },
      min: {
        width: width - (controllerIsVertical ? barLarge : 0),
        height: height - (controllerIsHorizontal ? barLarge : 0),
        x: location === 'left' ? barLarge : 0,
        y: location === 'top' ? barLarge : 0,
      },
    }
  }, [height, width, location, controllerFocused])

  const value = useMemo(() => {
    return {
      size,
      location,
      theme,
    }
  }, [size, location, theme])

  return (
    <ControllerContext.Provider value={value}>
      <Controller 
        focused={controllerFocused}
        onChangeFocused={(focus) => setControllerFocused(focus)}

        location={location}
        onChangeLocation={(location) => setLocation(location)}
        theme={theme}
        onToggleTheme={() => toggleTheme()}

        width={width}
        height={height}
      />
      {children}
    </ControllerContext.Provider>
  )
}

export const useController = () => useContext(ControllerContext)