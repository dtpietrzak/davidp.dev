type SystemSetting<T> = {
  value: T
  sync: boolean
}
export type SystemSettings = {
  theme: SystemSetting<"light" | "dark">
  controlBarLocation: SystemSetting<"top" | "right" | "bottom" | "left">
}

export type SystemUser = {
  id: string
  name: string
  image?: string
}

export type System = {
  settings: SystemSettings
  user: SystemUser
}