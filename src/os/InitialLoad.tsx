"use client"

import { useEffect } from "react"

export const InitialLoad = () => {
  useEffect(() => {
    function getIsIos() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    }
    
    function getIsPwa() {
      return window.matchMedia('(display-mode: standalone)').matches
    }
      
    if (getIsIos() && getIsPwa()) {
      // add 20px to the bottom of the screen to account for the home indicator
      document.documentElement.style.setProperty('--home-indicator-height', '20px')
    } else {
      document.documentElement.style.setProperty('--home-indicator-height', '0px')
    }

    const theme = localStorage.getItem('theme')
    if (theme) {
      if (theme === 'dark') {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
        document.body.style.setProperty('background', '#000')
      } else {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
        document.body.style.setProperty('background', '#FFF')
      }
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
        document.body.style.setProperty('background', '#000')
      } else {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
        document.body.style.setProperty('background', '#FFF')
      }
    }
  }, [])

  return null
}