"use client"

import { createContext, useContext, useState } from "react"
import { ControlBar } from "@/app/components/ControlBar"

const ControlBarContext = createContext({
  
})

type ControlBarProviderProps = {
  children: React.ReactNode
}

export const ControlBarProvider = ({ children }: ControlBarProviderProps) => {

  return (
    <ControlBarContext.Provider value={{  }}>
      <ControlBar />
      {children}
    </ControlBarContext.Provider>
  )
}