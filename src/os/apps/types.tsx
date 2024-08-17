import { App } from "@/os/apps/useApps"

export type AppId = 
  | 'file-explorer'
  | 'web-browser'
  | 'text-editor'
  | 'system-information'

export type AppAvail = {
  title: string
  icon: string
  multiInstance: boolean
  appId: string
  sync: boolean
  index: number
  app: App
}
export type AppsAvail = Record<string, AppAvail>

export type AppRunning = {
  menuIndex: number
  windowIndex: number
  appId: string
  instanceId: string
  title: string
  appData: Record<string, any> 
}

export type AppsRunning = Record<string, AppRunning>