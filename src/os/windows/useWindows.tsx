"use client"

import { windowManager } from "@/os/windows/windowManager"
import { createContext, useContext, useState } from "react"

const WindowsContext = createContext({
  openWindow: windowManager.openWindow,
  windowState: {},
})

type WindowsProviderProps = {
  children: React.ReactNode
}

export const WindowsProvider = ({ 
  children,
}: WindowsProviderProps) => {
  const [windowState, setWindowState] = useState({})

  const value = {
    openWindow: windowManager.openWindow,
    windowState: windowState,
  }

  return (
    <WindowsContext.Provider value={value}>
      {children}
    </WindowsContext.Provider>
  )
}

export const useWindows = () => useContext(WindowsContext)