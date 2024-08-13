"use client"

import { useMousePosition } from "@/hooks/useMouseLocation"
import { useResizeObserver } from "@/hooks/useResizeObserver"
import { useEffect, useState } from "react"
import { IoCloseCircle } from "react-icons/io5"

export const FileExplorer = () => {
  const [ref, resizeObv] = useResizeObserver()
  const [isDragging, setIsDragging] = useState(false)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [initialXClick, setInitialXClick] = useState(0)
  const [initialYClick, setInitialYClick] = useState(0)
  const [_x, _setX] = useState(localStorage.getItem('fileExplorerX') ? parseInt(localStorage.getItem('fileExplorerX')!) : 0)
  const [_y, _setY] = useState(localStorage.getItem('fileExplorerY') ? parseInt(localStorage.getItem('fileExplorerY')!) : 0)

  useEffect(() => {
    const mouseUp = () => {
      setIsDragging(false)
      localStorage.setItem('fileExplorerX', _x.toString())
      localStorage.setItem('fileExplorerY', _y.toString())
    }
    addEventListener('mouseup', mouseUp)
    return () => {
      removeEventListener('mouseup', mouseUp)
    }
  }, [_x, _y])

  useEffect(() => {
    const mouseMove = (mouseEvent: MouseEvent) => {
      if (isDragging) {
        const dx = mouseEvent.clientX - initialXClick
        const dy = mouseEvent.clientY - initialYClick
        _setX(initialX + dx)
        _setY(initialY + dy)
      }
    }
    addEventListener('mousemove', mouseMove)
    return () => {
      removeEventListener('mousemove', mouseMove)
    }
  }, [initialX, initialXClick, initialY, initialYClick, isDragging])

  return (
    <div ref={ref} className={`${isDragging ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'} absolute flex flex-row items-start min-w-[320px] min-h-[320px] bg-gray-600/50 rounded-xl backdrop-blur-md shadow-lg select-none`}
      style={{
        top: _y,
        left: _x
      }}
    >
      <div className="select-none flex flex-row mx-4 mt-1 pl-4 pr-1 justify-between items-center border border-gray-500/50 bg-gray-400/40 dark:bg-gray-600/40 backdrop-blur-md h-[24px] w-full rounded-xl cursor-move" 
        onMouseDown={(mouseEvent) => {
          setInitialX(_x)
          setInitialXClick(mouseEvent.clientX)
          setInitialY(_y)
          setInitialYClick(mouseEvent.clientY)
          setIsDragging(true)
        }}
      >
        <p className="select-none text-sm">File Explorer</p>
        <button onClick={() => {
          const fileExplorer = document.getElementById('file-explorer')
          if (fileExplorer) {
            fileExplorer.style.display = 'none'
            fileExplorer.remove()
          }
        }}>
          <IoCloseCircle size={18} className="opacity-80 hover:opacity-100" />
        </button>
      </div>
    </div>
  )
}