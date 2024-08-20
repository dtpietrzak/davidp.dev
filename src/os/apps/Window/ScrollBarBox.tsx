"use client"

import { useInterval, useSize, useThrottleFn } from 'ahooks'
import { FC, useEffect, useRef, useState } from 'react'
import { useScroll, useScrolling } from 'react-use'

type ScrollBarBoxProps = {
  children: React.ReactNode
  className?: string
}

export const ScrollBarBox: FC<ScrollBarBoxProps> = ({ 
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  let visibleSize = useSize(scrollRef)
  let contentSize = useSize(contentRef)
  if (!visibleSize || !contentSize) {
    visibleSize = { width: 1, height: 1 }
    contentSize = { width: 2, height: 2 }
  }

  const scroll = useScroll(scrollRef)
  const scrolling = useScrolling(scrollRef)

  const [scrollThumbHeight, setScrollThumbHeight] = useState(0)
  const [scrollFromTop, setScrollFromTop] = useState(0)

  const { run } = useThrottleFn(
    () => {
      const _scrollThumbHeight = Math.min(
        (visibleSize.height / contentSize.height) * visibleSize.height,
        visibleSize.height,
      )
      if (contentSize.height <= visibleSize.height) {
        setScrollThumbHeight(0)
        setScrollFromTop(0)
        return
      }
      const maxScrollableHeight = contentSize.height - visibleSize.height
      const maxScrollThumbTop = visibleSize.height - _scrollThumbHeight
      const _scrollFromTop = (scroll.y / maxScrollableHeight) * maxScrollThumbTop

      setScrollThumbHeight(_scrollThumbHeight)
      setScrollFromTop(_scrollFromTop)
    },
    { wait: 33 },
  )

  useEffect(() => {
    run()
  }, [run, scroll.y, visibleSize.height, contentSize.height])

  console.log("contentSize.height", contentSize.height)
  console.log("visibleSize.height", visibleSize.height)
  
  return (
    <div
      ref={scrollRef}
      className={`w-full h-full scrollbar-hide overflow-scroll ${className ?? ''}`}
    >
      <div 
        className={`absolute right-0 w-[7px] rounded-md hover:bg-gray-500 ${
          scrolling ? 'bg-gray-500' : 'bg-gray-500/30'
        }`}
        style={{
          top: scrollFromTop + 7,
          height: scrollThumbHeight,
          transition: 'background-color 0.5s ease-out',
        }}
      />
      <div
        ref={contentRef}
        className={`w-full px-1 pt-1 ${contentSize.height <= visibleSize.height ? 'h-full' : 'h-fit-content'}`}
      >
        {children}
      </div>
    </div>
  )
}