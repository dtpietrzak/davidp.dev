"use client"

import { useMousePosition } from "@/hooks/useMouseLocation"
import { useToolTip } from "@/hooks/useToolTip"
import { useWindowSize } from "@/hooks/useWindowSize"
import { useClickAway } from "@/hooks/useClickAway"
import { Component, FC, useCallback, useEffect, useState } from "react"

import { BiWindows, BiDotsVertical } from "react-icons/bi"
import { IoIosApps } from "react-icons/io"
import { PiFilesDuotone } from "react-icons/pi"
import { RiSettings3Line, RiAccountBoxLine, RiMenuFill } from "react-icons/ri"
import { IconBase, IconType } from "react-icons"

let timeInControlBarHitbox = 0

type ControlBarOptions = {
  location: 'top' | 'bottom' | 'left' | 'right'
}

const locationsArray: ControlBarOptions['location'][] = ['right', 'left', 'top', 'bottom']

export const ControlBar = () => {
  const { x, y } = useMousePosition()
  const { openToolTip, closeToolTip } = useToolTip()
  const { width, height } = useWindowSize()
  
  const [mouseInControlHandle, setMouseInControlHandle] = useState(false)
  const [controlBarFocused, setControlBarFocused] = useState(false)
  const [temp, setTemp] = useState(0)
  const [location, setLocation] = 
  useState<ControlBarOptions['location']>(locationsArray[temp])
  
  const clickAwayRef = useClickAway(() => {
    if (controlBarFocused && (
      location === 'top' && y > 52 ||
      location === 'bottom' && y < height - 52 ||
      location === 'left' && x > 52 ||
      location === 'right' && x < width - 52
    )) {
      timeInControlBarHitbox = 0
      setControlBarFocused(false)
      setMouseInControlHandle(false)
    }
  })

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

  const iconSize = () => (controlBarFocused ? 24 : 12)
  const iconColor = () => `dark:text-white text-black`

  return (
    <>
      <div 
        ref={clickAwayRef}
        className={
          `z-30 overflow-hidden fixed transition-all ease-out backdrop-blur-xl border-gray-500/50 ${ 
            controlBarFocused ? 'shadow-[0px_0px_12px_4px_rgb(0,0,0,0.1)] bg-gray-400/30 dark:bg-gray-600/30' : 'shadow-[inset_2px_-1px_4px_rgb(0,0,0,0.05)] bg-gray-300/10 dark:bg-gray-700/10'
          } ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `w-full ${ controlBarFocused ? 'h-[52px]' : 'h-[11px]' }` : 
            // left or right
              `h-[calc(100dvh)] ${ controlBarFocused ? 'w-[52px]' : 'w-[11px]' }` 
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
          className={`flex w-full h-full justify-between items-center ${
            location === 'top' || location === 'bottom' ? 'flex-row' : 'flex-col'
          } ${ controlBarFocused ? 'opacity-100' : 'opacity-50' }`}
        >
          <div className={`${
            location === 'top' || location === 'bottom' ? 'flex' : 'flex-col'
          }`}>
            <IconButton 
              Icon={RiSettings3Line} controlBarFocused={controlBarFocused}
              onClick={() => {
                setTemp((prev) => {
                  return prev === 3 ? 0 : (prev + 1)
                })
                setLocation(locationsArray[temp])
              }}
            />
            <IconButton 
              Icon={RiAccountBoxLine} controlBarFocused={controlBarFocused}
              onClick={() => {}}
            />
          </div>
          <div className={`${
            location === 'top' || location === 'bottom' ? 'flex flex-row' : 'flex flex-col'
          }`}>
            <IconButton 
              Icon={PiFilesDuotone} controlBarFocused={controlBarFocused}
              onClick={() => {}}
            />
            <IconButton 
              Icon={IoIosApps} controlBarFocused={controlBarFocused}
              onClick={() => {}}
            />
            <div className="h-[52px] w-[52px]" />
          </div>
        </div>
      </div>

      <div
        className={
          `z-40 transition-all duration-300 fixed border hover:bg-gray-100/60 dark:hover:bg-gray-700/60 backdrop-blur-xl flex justify-center items-center cursor-pointer ${controlBarFocused ? 'border-transparent bg-transparent m-0' : 'border-gray-500/50 bg-gray-200/30 dark:bg-gray-600/40 shadow-md m-[2px]'} ${
            location === 'top' || location === 'bottom' ?
            // top or bottom
              `${controlBarFocused ? 'w-[52px]' : 'w-[44px]'}` : 
            // left or right
              `${controlBarFocused ? 'h-[52px]' : 'h-[44px]'}` 
          } ${
            location === 'top' ? `top-0 right-0 ${controlBarFocused ? 'rounded-none h-[51px]' : 'rounded-[22px] h-[44px]'}` : ''
          }${
            location === 'bottom' ? `bottom-0 right-0 ${controlBarFocused ? 'rounded-none h-[51px]' : 'rounded-[22px] h-[44px]'}` : ''
          }${
            location === 'left' ? `left-0 bottom-0 ${controlBarFocused ? 'rounded-none w-[51px]' : 'rounded-[22px] w-[44px]'}` : ''
          }${
            location === 'right' ? `right-0 bottom-0 ${controlBarFocused ? 'rounded-none w-[51px]' : 'rounded-[22px] w-[44px]'}` : ''
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
              className={`${iconColor()} drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={24}
            /> : 
            <BiDotsVertical 
              className={`${iconColor()} drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={24}
            />
        }
      </div>
    </>
    
  )
}

type IconButtonProps = {
  Icon: IconType
  controlBarFocused: boolean
  onClick: () => void
  size?: number
}

const IconButton: FC<IconButtonProps> = ({
  Icon,
  controlBarFocused,
  onClick,
  size,
}) => {
  const iconSize = () => (controlBarFocused ? 24 : 12)
  const iconColor = () => `dark:text-white text-black`

  return (
    <button className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-700/60" onClick={onClick}>
      <Icon
        className={`${iconColor()} drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={size ?? iconSize()}
      />
    </button>
  )
}