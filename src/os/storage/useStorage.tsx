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

export const useStorage = () => {

  const toSave = (data: any) => {
    return JSON.stringify(data)
  }

  const saveSystem = (system: System) => {
    try {
      // localStorage

      const saveId = system.user.userId + "-system"
      const saveData = toSave(system)

      localStorage.setItem(saveId, saveData)

    } catch (error) {
      console.error("Failed to save to localStorage", error)
    }

    try {
      // TODO: server
    } catch (error) {
      console.error("Failed to save to server", error)
    }
  }
}
















