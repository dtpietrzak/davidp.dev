import { SystemSettings, SystemUser } from '@/os/system/types'
import { Root } from 'react-dom/client'

// we want to explicitly choose which system properties are given to apps
// this way we dont accidentally willy nilly give everything
// (of course really skilled people can bypass it anyway,
// but that's beside the point, this is a mockery of an OS in the first place)
type SystemSettingsDataForApp = Pick<SystemSettings, 'controlBarLocation' | 'theme'>
type SystemUserDataForApp = Pick<SystemUser, 'userId'>
export type SystemDataForApp = SystemSettingsDataForApp & SystemUserDataForApp
export type AppComponent = (systemData: SystemDataForApp) => React.ReactNode

export type RenderableApp = {
  title: string
  uaiid: string // unique app instance id
  app: AppComponent
}
export type RenderApp = (
  appToRender: RenderableApp, systemData: SystemDataForApp,
) => React.ReactNode

export type Application = {
  title: string
  appId: string
  multiInstance: boolean
  icon: string
  app: AppComponent
}

/**
 * the apps that are available for the user to "run"
 * 
 * should never change dynamically / is hard coded
 *  * // currently also controls menu index
 */
export type AppAvail = Application & {
  menuIndex: number
}
export type AppsAvail = Record<string, AppAvail>

/**
 * localStorage state of all apps, running and/or closed, and their stored window states
 * 
 * should always persist to localStorage on changes
 */
export type AppWindow = {
  appId: string
  instanceId: number
  width: number
  height: number
  x: number
  y: number
  zIndex: number
  open: boolean
  appData: Record<string, any>
}
export type AppsWindows = Record<string, AppWindow>


/**
 * in-memory state of all running apps
 * 
 * should never touch persistence
 */
export type AppRunning = {
  menuIndex: number
  appId: string
  instanceId: number
  uaiid: string
  title: string
  appData: Record<string, any>
}

export type AppsRunning = Record<string, AppRunning>


export type WindowLocation = {
  x: number;
  y: number;
  width: number;
  height: number;
}