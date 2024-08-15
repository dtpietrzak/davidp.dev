"use client"

import { createContext, useContext, useState } from "react"

const StorageContext = createContext({
})

type StorageProviderProps = {
  children: React.ReactNode
}

export const StorageProvider = ({ 
  children,
}: StorageProviderProps) => {

  const value = {}

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}

export const useStorage = () => useContext(StorageContext)