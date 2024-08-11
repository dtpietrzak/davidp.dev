import { useState, useEffect } from "react"

export const useMousePosition = () => {

  const [
    mousePosition,
    setMousePosition
  ] = useState<{x: number, y: number}>({ x: -1, y: -1 })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return mousePosition
}