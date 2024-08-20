import { FC } from 'react'

type ScrollBarBoxProps = {
  children: React.ReactNode
  className?: string
}

export const ScrollBarBox: FC<ScrollBarBoxProps> = ({ 
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