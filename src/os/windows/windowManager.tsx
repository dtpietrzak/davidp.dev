import { openFileExplorer } from "@/apps/FileExplorer"
import { OpenWindowOsData } from "@/os/windows/types"

const apps = {
  file_explorer: openFileExplorer,
} as const

type AppName = keyof typeof apps

export type OsData = {
  userId: string
}

const prepOsData = (osData: OsData): OpenWindowOsData => {
  return {
    forApp: {
      userId: osData.userId,
    },
    forRender: {
      userId: osData.userId,
    },
  }
}

export const windowManager = {
  openWindow: (appName: AppName, osData: OsData) => {
    const appData = apps[appName](prepOsData(osData))
    if (!appData) {
      console.error(`${appName} failed to open`)
      return
    } else {
      console.log(`${appData.title} opened`)
      return appData
    }
  },
}