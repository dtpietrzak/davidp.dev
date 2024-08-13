import { FC } from 'react'
import { Scrollbar } from 'react-scrollbars-custom'

type ScrollBarProps = {
  children: React.ReactNode
}

export const ScrollBar: FC<ScrollBarProps> = ({ children }) => {
  
  return (
    <Scrollbar className="w-full h-full"
      trackYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props
          return (
            <div 
              {...restProps} 
              ref={elementRef} 
              onTouchStart={(e) => {
                restProps?.onTouchStart?.(e)
              }}
              className={`trackY !w-1.5`} 
            />
          )
        }
      }}
    >
      {children}
    </Scrollbar>
  )
}