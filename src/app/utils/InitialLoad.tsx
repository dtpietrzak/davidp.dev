"use client"

import { useEffect, useState } from "react"

export const InitialLoad = () => {
  const [isIos, setIsIos] = useState<string>("")
  const [isPwa, setIsPwa] = useState(false)

  useEffect(() => {
    function getIsIos() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    }
    // setIsIos(getIsIos())
    
    function getIsPwa() {
      return window.matchMedia('(display-mode: standalone)').matches
    }
    setIsPwa(getIsPwa())
      
    if (getIsIos() && getIsPwa()) {
      // get safe-area-inset-bottom
      const safeAreaBottom = window.getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')
      setIsIos(safeAreaBottom)

      // add 20px to the bottom of the screen to account for the home indicator
      document.documentElement.style.setProperty('--home-indicator-height', '20px')
    } else {
      document.documentElement.style.setProperty('--home-indicator-height', '0px')
    }
  }, [])

  return <p>{isIos}</p>
}