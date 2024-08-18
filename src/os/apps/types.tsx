import { SystemSettings, SystemUser } from "@/os/system/types"
import { Root } from "react-dom/client"

// we want to explicitly choose which system properties are given to apps
// this way we dont accidentally willy nilly give everything
// (of course really skilled people can bypass it anyway,
// but that's beside the point, this is a mockery of an OS in the first place)
type SystemSettingsDataForApp = Pick<SystemSettings, "controlBarLocation" | "theme">
type SystemUserDataForApp = Pick<SystemUser, "userId">
export type SystemDataForApp = SystemSettingsDataForApp & SystemUserDataForApp
export type AppComponent = (systemData: SystemDataForApp) => React.ReactNode

export type RenderableApp = {
  title: string
  uaiid: string // unique app instance id
  app: AppComponent
}
export type RenderApp = (
  appToRender: RenderableApp, systemData: SystemDataForApp,
) => Root | null

export type Application = {
  title: string
  appId: string
  multiInstance: boolean
  icon: string
  app: AppComponent
}

export type AppAvail = Application & {
  sync: boolean
  index: number
}
export type AppsAvail = Record<string, AppAvail>

export type AppRunning = {
  menuIndex: number
  windowIndex: number
  appId: string
  instanceId: number
  uaiid: string
  title: string
  appData: Record<string, any>
  appRoot: Root
}

export type AppsRunning = Record<string, AppRunning>