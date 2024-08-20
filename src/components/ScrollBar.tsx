import { FC } from 'react'
import { CustomScroll } from 'react-custom-scroll'

type ScrollBarProps = {
  children: React.ReactNode
  className?: string
}

export const ScrollBar: FC<ScrollBarProps> = ({ 
  children,
  className,
}) => {
  return (
    <div
      className={`w-full h-full scrollbar-hide overflow-scroll ${className} bg-red-500`}
    >
      {children}
    </div>
  )
}