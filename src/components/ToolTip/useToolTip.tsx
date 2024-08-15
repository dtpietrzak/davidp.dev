"use client"

import { createContext, useContext, useState } from "react"
import { ToolTip } from "@/components/ToolTip/ToolTip"

const ToolTipContext = createContext({
  openToolTip: (text: string) => {},
  closeToolTip: () => {},
})

type ToolTipProviderProps = {
  children: React.ReactNode
}

export const ToolTipProvider = ({ children }: ToolTipProviderProps) => {
  const [toolTipText, setToolTipText] = useState("")
  const [toolTipVisible, setToolTipVisible] = useState(false)

  const openToolTip = (text: string) => {
    setToolTipText(text)
    setToolTipVisible(true)
  }

  const closeToolTip = () => {
    setToolTipText("")
    setToolTipVisible(false)
  }

  return (
    <ToolTipContext.Provider value={{ openToolTip, closeToolTip }}>
      <ToolTip show={toolTipVisible} text={toolTipText} />
      {children}
    </ToolTipContext.Provider>
  )
}

export const useToolTip = () => useContext(ToolTipContext)