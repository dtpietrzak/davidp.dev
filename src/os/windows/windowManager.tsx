"use client"

import { createRoot } from "react-dom/client"

import { 
  OpenWindow,
  OpenWindowAppData,
  OpenWindowOsData,
  RenderWindowProps,
} from "@/os/windows/types"

import { Window } from "@/os/windows/Window"
import { openFileExplorer } from "@/apps/FileExplorer/app"

export const renderWindow = (
  { title, windowId, app }: RenderWindowProps,
  forRender: OpenWindowOsData['forRender'],
): OpenWindowAppData | null => {
  const element = document.getElementById(windowId) ?? document.createElement('div')
  element.id = windowId

  const main = document.getElementById('main')
  if (!main) return null
  main.appendChild(element)

  const componentRoot = createRoot(element)
  componentRoot.render(
    <Window
      title={title}
      windowId={windowId}
      userId={forRender.userId}
    >
      { app }
    </Window>
  )

  return {
    title: title,
    windowId: windowId,
  }
}

const openGenericWindow: OpenWindow = (osData) => {
  return renderWindow({
    title: 'Generic Window',
    windowId: 'generic-window',
    app: <></>,
  }, osData.forRender)
}

const apps = {
  'file-explorer': openFileExplorer,
  'web-browser': openGenericWindow,
  'text-editor': openGenericWindow,
  'system-information': openGenericWindow,
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