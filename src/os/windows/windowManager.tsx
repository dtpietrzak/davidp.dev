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
import { openTextEditor } from "@/apps/TextEditor/app"

export const renderWindow = (
  { title, windowId, app }: RenderWindowProps,
  forRender: OpenWindowOsData['forRender'],
): OpenWindowAppData | null => {
  if (document.getElementById(windowId)) {
    console.error(`${windowId} already open 1`)
    return null
  }

  const element = document.createElement('div')
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
  'text-editor': openTextEditor,
  'system-information': openGenericWindow,
} as const

export type AppName = keyof typeof apps

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

export const windowManager: WindowManager = {
  openWindow: (appName: AppName, osData: OsData) => {
    const appData = apps[appName](prepOsData(osData))
    if (!appData) {
      console.error(`${appName} failed to open`)
      return
    } else {
      const newState = { ...windowManager.state }
      for (const windowId in newState) {
        newState[windowId].index += 1
      }
      windowManager.state = {
        ...newState,
        [appData.windowId]: {
          title: appData.title,
          windowId: appData.windowId,
          index: 0,
        },
      }
      localStorage.setItem(`${osData.userId}-windowState`, JSON.stringify(windowManager.state))
      return appData
    }
  },
  closeWindow: (userId: string, windowId: string) => {
    const Window = document.getElementById(windowId)
    if (Window) {
      delete windowManager.state[windowId]
      localStorage.setItem(`${userId}-windowState`, JSON.stringify(windowManager.state))
      Window.style.display = 'none'
      Window.remove()
    } else {
      console.error(`${windowId} - tried to close but window not found`)
    }
  },
  state: {

  },
}

if (typeof window !== 'undefined') {
  window.windowManager = windowManager
}