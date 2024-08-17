export type AppId = 
  | 'file-explorer'
  | 'web-browser'
  | 'text-editor'
  | 'system-information'

export type AppAvail<T extends string> = {
  index: number
  appId: T
  title: string
  icon: string
  sync: boolean
}
export type AppsAvail<T extends string> = Record<T, AppAvail<T>>

export type AppRunning<T extends string> = {
  menuIndex: number
  windowIndex: number
  appId: T
  instanceId: string
  title: string
  appData: Record<string, any> 
}

export type AppsRunning<T extends string> = Record<string, AppRunning<T>>