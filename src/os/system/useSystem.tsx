"use client"

import { createContext, useContext, useState } from "react"

const SystemContext = createContext({
})

type SystemProviderProps = {
  children: React.ReactNode
}

export const SystemProvider = ({ 
  children,
}: SystemProviderProps) => {

  const value = {}

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystem = () => useContext(SystemContext)