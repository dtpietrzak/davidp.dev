type VerticalLocation = 'top' | 'bottom'
type HorizontalLocation = 'left' | 'right'

export type ControllerBiLocation = 'top-left' | 'bottom-right'

export type ControllerLocation = VerticalLocation | HorizontalLocation

export type ControllerOptions = {
  location: ControllerLocation
}