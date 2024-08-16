import { FC } from "react"
import { IconType } from "react-icons"

type ControllerButtonProps = {
  Icon: IconType
  controllerFocused: boolean
  onClick: () => void
  size?: number
}

export const ControllerButton: FC<ControllerButtonProps> = ({
  Icon,
  controllerFocused,
  onClick,
  size,
}) => {
  const iconSize = () => (controllerFocused ? 24 : 12)
  const iconColor = () => `dark:text-white text-black`

  return (
    <button className="flex justify-center items-center transition duration-200 h-[52px] w-[52px] cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-500/60" onClick={onClick}>
      <Icon
        className={`${iconColor()} drop-shadow-[0px_0px_5px_rgba(255,255,255,0.25)]`} size={size ?? iconSize()}
      />
    </button>
  )
}