"use client"

import { useMousePosition } from "@/hooks/useMouseLocation"
import { useToolTip } from "@/hooks/useToolTip"
import { useWindowSize } from "@/hooks/useWindowSize"
import { useCallback, useEffect, useState } from "react"

import {  } from "react-icons/ri"
import { BiWindows } from "react-icons/bi"
import { IoIosApps } from "react-icons/io"
import { PiFilesDuotone } from "react-icons/pi"
import { RiSettings3Line, RiAccountBoxLine, RiMenuFill } from "react-icons/ri"

let timeInControlBarHitbox = 0

type ControlBarOptions = {
  location: 'top' | 'bottom' | 'left' | 'right'
}

export const ControlBar = () => {
  const { x, y } = useMousePosition()
  const { openToolTip, closeToolTip } = useToolTip()
  const { width, height } = useWindowSize()

  const [mouseInControlHandle, setMouseInControlHandle] = useState(false)
  const [controlBarFocused, setControlBarFocused] = useState(false)
  const [location, setLocation] = 
    useState<ControlBarOptions['location']>('right')

  const handleControlBarFocused = useCallback((
    relativeMousePosition: number,
    _mouseInControlHandle: boolean,
  ) => {
    if (!controlBarFocused) {
      if (_mouseInControlHandle) {
        timeInControlBarHitbox = 5
        setControlBarFocused(true)
      } else if ((relativeMousePosition >= 0 && relativeMousePosition < 10)) {
        if (timeInControlBarHitbox > 5) setControlBarFocused(true)
        else timeInControlBarHitbox++
      } else {
        timeInControlBarHitbox = 0
        setControlBarFocused(false)
      }
    } else {
      if ((relativeMousePosition >= 0 && relativeMousePosition < 52) || _mouseInControlHandle) {
        if (timeInControlBarHitbox > 5) setControlBarFocused(true)
        else timeInControlBarHitbox++
      } else {
        timeInControlBarHitbox = 0
        setControlBarFocused(false)
      }
    }
  }, [controlBarFocused])

  const logicClockCallback = useCallback(() => {

    switch (location) {
      case 'top':
        handleControlBarFocused(y, mouseInControlHandle)
        break
      case 'bottom':
        handleControlBarFocused(height - y, mouseInControlHandle)
        break
      case 'left':
        handleControlBarFocused(x, mouseInControlHandle)
        break
      case 'right':
        handleControlBarFocused(width - x, mouseInControlHandle)
        break
    }
    
  }, [handleControlBarFocused, mouseInControlHandle, height, location, width, x, y])

  useEffect(() => {
    const intervalId = setInterval(logicClockCallback, 33)
    return () => clearInterval(intervalId)
  }, [logicClockCallback])

  const iconSize = () => (controlBarFocused ? 24 : 18)
  const iconColor = () => `${controlBarFocused ? 'dark:text-white text-black' : 'dark:text-white/50 text-black/50'}`

  return (
    <div 
      className={
        `z-40 overflow-hidden fixed transition-all ease-out bg-slate-500/30 backdrop-blur-xl border-slate-500/50 ${
          location === 'top' || location === 'bottom' ?
            // top or bottom
            `w-full ${ controlBarFocused ? 'h-[52px]' : 'h-[14px]' }` : 
            // left or right
            `h-[calc(100dvh)] ${ controlBarFocused ? 'w-[52px]' : 'w-[14px]' }` 
        } ${
          location === 'top' ? 'border-b top-0' : ''
        }${
          location === 'bottom' ? 'border-t bottom-0' : ''
        }${
          location === 'left' ? 'border-r left-0' : ''
        }${
          location === 'right' ? 'border-l right-0' : ''
        }`
      }
    >
      <div
        className={
          `z-30 transition-all duration-150 fixed hover:bg-slate-500/60 backdrop-blur-xl flex justify-center items-center cursor-pointer ${controlBarFocused ? 'border-slate-500/30 bg-slate-500/10' : 'border-slate-500/0 bg-slate-500/40'} ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `${controlBarFocused ? 'w-[52px]' : 'w-[48px]'}` : 
            // left or right
              `${controlBarFocused ? 'h-[52px]' : 'h-[48px]'}` 
          } ${
            location === 'top' ? `top-0 right-0 border-b ${controlBarFocused ? 'rounded-bl-none w-[52px]' : 'rounded-bl-2xl h-[48px]'}` : ''
          }${
            location === 'bottom' ? `rounded-tl-lg border-t bottom-0 right-0 ${controlBarFocused ? 'rounded-tl-none h-[52px]' : 'rounded-tl-2xl w-[48px]'}` : ''
          }${
            location === 'left' ? `rounded-tr-lg border-r left-0 bottom-0 ${controlBarFocused ? 'rounded-tr-none w-[52px]' : 'rounded-tr-2xl w-[48px]'}` : ''
          }${
            location === 'right' ? `rounded-tl-lg border-l right-0 bottom-0 ${controlBarFocused ? 'rounded-tl-none w-[52px]' : 'rounded-tl-2xl w-[48px]'}` : ''
          }`
        }
        onMouseEnter={() => {
          setMouseInControlHandle(true)
        }}
        onMouseLeave={() => {
          setMouseInControlHandle(false)
        }}
        onClick={() => {
          setControlBarFocused(true)
        }}
      >
        {
          controlBarFocused ? 
            <BiWindows 
              className="dark:text-white text-black" size={24}
            /> : 
            <RiMenuFill 
              className="dark:text-white text-black" size={24}
            />
        }
      </div>
      <div className="flex flex-col w-full h-full justify-between items-center">
        <div>
          <div className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-slate-500/60">
            <RiSettings3Line 
              className={`${iconColor}`} size={iconSize()}
            />
          </div>
          <div className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-slate-500/60">
            <RiAccountBoxLine 
              className={`${iconColor}`} size={iconSize()}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-slate-500/60">
            <PiFilesDuotone 
              className={`${iconColor}`} size={iconSize()}
            />
          </div>
          <div className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-slate-500/60">
            <IoIosApps 
              className={`${iconColor}`} size={iconSize()}
            />
          </div>
          <div className="h-[52px] w-full" />
        </div>
      </div>
    </div>
  )
}