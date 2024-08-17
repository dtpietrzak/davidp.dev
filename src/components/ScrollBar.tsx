import { FC } from 'react'
import { Scrollbar } from 'react-scrollbars-custom'

type ScrollBarProps = {
  children: React.ReactNode
  className?: string
}

export const ScrollBar: FC<ScrollBarProps> = ({ 
  children,
  className,
}) => {
  return (
    <Scrollbar
      contentProps={{
        className: `w-full h-full ${className}`,
      }}
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
              className={`${restProps.className} trackY !w-1.5`} 
            />
          )
        }
      }}
    >
      {children}
    </Scrollbar>
  )
}