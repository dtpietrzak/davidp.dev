import { FC } from "react"
import { ControllerBiLocation, ControllerOptions } from "@/os/controller/Controller/types"

export type MenuItem = {
  icon: string
  title: string
  menuId: string
  onClick: () => void
}

type MenuProps = {
  direction: ControllerBiLocation | null
  controllerLocation: ControllerOptions['location']
  menuSelected: string
  items: MenuItem[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const Menu: FC<MenuProps> = ({
  direction,
  controllerLocation,
  menuSelected,
  items,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!direction) return null

  let emptyWindows = false

  if (items.length === 0) {
    if (menuSelected === 'windows') emptyWindows = true
    else return null
  }

  return (
    <div 
      className={`flex flex-col border border-gray-500/50 font-sm dark:text-white text-black py-1.5 pl-1.5 pr-1 fixed z-2000 h-fit max-h-full min-w-[240px] max-w-[480px] bg-gray-400/30 dark:bg-gray-600/30 backdrop-blur-md shadow-md overflow-scroll scrollbar-hide ${
        controllerLocation === 'top' ? 'top-[52px] rounded-b-2xl' : ''
      } ${
        controllerLocation === 'bottom' ? 'safe-bottom-minus-bar rounded-t-2xl' : ''
      } ${
        controllerLocation === 'left' ? 'left-[52px] rounded-r-2xl' : ''
      } ${
        controllerLocation === 'right' ? 'right-[52px] rounded-l-2xl' : ''
      } ${
        (
          (controllerLocation === 'top' || controllerLocation === 'bottom') &&
          direction === 'top-left'
        ) ? 'left-0' : ''
      } ${
        (
          (controllerLocation === 'top' || controllerLocation === 'bottom') &&
          direction === 'bottom-right'
        ) ? 'right-0' : ''
      } ${
        (
          (controllerLocation === 'left' || controllerLocation === 'right') &&
          direction === 'top-left'
        ) ? 'top-0' : ''
      } ${
        (
          (controllerLocation === 'left' || controllerLocation === 'right') &&
          direction === 'bottom-right'
        ) ? 'safe-bottom' : ''
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {
        emptyWindows ? 
          <div className="flex justify-center items-center w-full h-8">
            <p className="font-sm opacity-70">No Windows Open</p>
          </div> 
          :
          items.map((item, index) => {
            return (
              <div key={item.menuId}>
                {
                  index !== 0 ?
                    <div className="w-full flex justify-center items-center">
                      <div className="bg-gray-500/20 dark:bg-gray-500/20 w-[calc(100%-24px)] h-[1px]" />
                    </div> :
                    <></>
                }
                <button
                  className={`flex font-sm !text-[0.9em] items-center justify-start w-full py-2 px-4 hover:bg-gray-100/60 dark:hover:bg-gray-500/60 cursor-pointer rounded-xl my-[2px] shadow-none hover:shadow`}
                  onClick={() => {
                    item.onClick()
                  }}
                >
                  {item.title}
                </button>
              </div>
            )
          })
      }
    </div>
  )
}