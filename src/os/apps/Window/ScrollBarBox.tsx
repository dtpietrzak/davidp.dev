"use client"

import { FC, useEffect, useRef, useState, MouseEvent as ReactMouseEvent, useCallback } from 'react'
import { useScroll, useScrolling } from 'react-use'
import { useThrottleFn } from 'ahooks'

type ScrollBarBoxProps = {
  children: React.ReactNode
  className?: string
}

export const ScrollBarBox: FC<ScrollBarBoxProps> = ({ 
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = useScroll(scrollRef)
  const scrolling = useScrolling(scrollRef)

  const [scrollThumbHeight, setScrollThumbHeight] = useState(0)
  const [scrollFromTop, setScrollFromTop] = useState(0)

  const [dragY, setDragY] = useState<number | null>(null)
  const [scrollBeforeDrag, setScrollBeforeDrag] = useState(0)

  const { run } = useThrottleFn(() => {
    if (scrollRef.current === null) return
    const clientHeight = scrollRef.current.clientHeight
    const scrollHeight = scrollRef.current.scrollHeight

    const _scrollThumbHeight = Math.min(
      (clientHeight / scrollHeight) * clientHeight,
      clientHeight,
    )
    if (scrollHeight <= clientHeight) {
      setScrollThumbHeight(0)
      setScrollFromTop(0)
      return
    }
    const maxScrollableHeight = scrollHeight - clientHeight
    const maxScrollThumbTop = clientHeight - _scrollThumbHeight
    const _scrollFromTop = (scroll.y / maxScrollableHeight) * maxScrollThumbTop

    if (_scrollFromTop < -64) {
      setScrollThumbHeight(_scrollThumbHeight)
      setScrollFromTop(-32)
      return
    } else if (_scrollFromTop < 0) {
      setScrollThumbHeight(_scrollThumbHeight)
      setScrollFromTop(_scrollFromTop*0.5)
      return
    } else if (_scrollFromTop > maxScrollThumbTop + 64) {
      setScrollThumbHeight(_scrollThumbHeight)
      setScrollFromTop(maxScrollThumbTop + 32)
      return
    } else if (_scrollFromTop > maxScrollThumbTop) {
      setScrollThumbHeight(_scrollThumbHeight)
      setScrollFromTop(_scrollFromTop*0.5 + maxScrollThumbTop*0.5)
      return
    }

    setScrollThumbHeight(_scrollThumbHeight)
    setScrollFromTop(_scrollFromTop)
  }, { wait: 33 })

  useEffect(() => { run() }, [run, scroll.y, scrollRef.current?.clientHeight])

  const onMouseMove = useCallback((mouseEvent: MouseEvent | Touch) => {
    if (dragY === null) return
    if (scrollRef.current === null) return
    const moveY = dragY - mouseEvent.clientY
    scrollRef.current.scrollTop = scrollBeforeDrag - moveY
  }, [dragY, scrollBeforeDrag])

  const onMouseUp = () => {
    setDragY(null)
    setScrollBeforeDrag(0)
  }

  useEffect(() => {
    if (dragY === null) return
    addEventListener('mousemove', onMouseMove)
    addEventListener('mouseup', onMouseUp)
    return () => {
      removeEventListener('mousemove', onMouseMove)
      removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, dragY])
  
  return (
    <div
      ref={scrollRef}
      className={`w-full h-full scrollbar-hide overflow-scroll ${className ?? ''}`}
    >
      <div 
        className={`absolute right-0 w-[7px] rounded-md border border-gray-500/50 hover:bg-gray-500 ${
          scrolling ? 'bg-gray-500' : 'bg-gray-500/30'
        }`}
        style={{
          top: scrollFromTop + 10,
          height: scrollThumbHeight,
          transition: 'background-color 0.5s ease-out',
        }}
        onMouseDown={(mouseEvent: ReactMouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
          mouseEvent.preventDefault()
          if (!scrollRef.current) return
          setDragY(mouseEvent.clientY)
          setScrollBeforeDrag(scrollRef.current.scrollTop)
        }}
      />
      <div className={`w-full h-full px-1 pt-1`}>
        {children}
      </div>
    </div>
  )
}