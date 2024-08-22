'use client'

import { createContext, useContext, useState } from 'react'
import { Controller } from '@/os/controller/Controller'

const ControllerContext = createContext({
  
})

type ControllerProviderProps = {
  children: React.ReactNode
}

export const ControllerProvider = ({ children }: ControllerProviderProps) => {

  return (
    <ControllerContext.Provider value={{  }}>
      <Controller />
      {children}
    </ControllerContext.Provider>
  )
}

export const useController = () => useContext(ControllerContext)