"use client"

import { atom } from "jotai"
import { useImmerAtom } from "jotai-immer"
import { mergeDeep } from "immutable"
import { AppAvail, AppId, AppRunning, AppsAvail, AppsRunning } from "@/os/apps/types"
import { defaultApps } from "@/os/apps/defaults"
import { FC, useCallback, useMemo } from "react"
import { openFileExplorer } from "@/apps/FileExplorer/app"
import { openTextEditor } from "@/apps/TextEditor/app"
import { Window } from "@/os/apps/Window"
import { createRoot } from "react-dom/client"

const atomAppsAvail = atom(defaultApps satisfies AppsAvail<AppId>)
const atomAppsRunning = atom({} as AppsRunning<AppId>)

export const useApps = () => {
  /**
   * 
   * Apps Avail - Apps Avail - Apps Avail
   * 
   */
  const [getAppsAvail, setAppsAvail] = useImmerAtom(atomAppsAvail)
  const appsAvailMenu = useMemo(() => {
    return Object.values(getAppsAvail).sort((a, b) => a.index - b.index)
  }, [getAppsAvail])

  const addAppAvail = useCallback((app: AppAvail<AppId>) => {
    const appIds = Object.keys(getAppsAvail) as AppId[]
    if (app.appId in appIds) {
      throw new Error(`App with id ${app.appId} already exists`)
    }
    setAppsAvail((draft) => {
      draft[app.appId] = app
    })
  }, [getAppsAvail, setAppsAvail])

  const reorderAppAvail = useCallback((appId: AppId, indexRequest: number) => {
    for (let i = 0; i < appsAvailMenu.length; i++) {
      const appMoving = appsAvailMenu[i]
      if (appMoving.appId === appId) {
        if (appMoving.index === indexRequest) {
          // exit early, no changes needed
          return true
        } else if (appMoving.index < indexRequest) {
          const newAppsAvail = { ...getAppsAvail }
          // set as requested
          newAppsAvail[appId].index = indexRequest
          // then go back and shift the in-betweens down
          // no need to go to the end of the array
          // just until you hit the requested index
          for (let j = i + 1; j < indexRequest - 1; j++) {
            appsAvailMenu[j].index--
          }
          // set appsAvail to newAppsAvail
          setAppsAvail((draft) => {
            draft = newAppsAvail
          })
          return true
        } else if (appMoving.index > indexRequest) {
          const newAppsAvail = { ...getAppsAvail }
          // set as requested
          newAppsAvail[appId].index = indexRequest
          // then go back and shift the rest up
          for (let j = i - 1; j >= 0; j--) {
            appsAvailMenu[j].index++
          }
          // set appsAvail to newAppsAvail
          setAppsAvail((draft) => {
            draft = newAppsAvail
          })
          return true
        }
        continue
      }
    }
    // we got here, so the app must not exist!
    throw new Error(`App with id ${appId} does not exist`)
  }, [appsAvailMenu, getAppsAvail, setAppsAvail])

  const removeAppAvail = useCallback((appId: (keyof typeof getAppsAvail)) => {
    setAppsAvail((draft) => {
      delete draft[appId]
    })
  }, [setAppsAvail])

  /**
   * 
   * Apps Running - Apps Running - Apps Running
   * 
   */
  const [getAppsRunning, setAppsRunning] = useImmerAtom(atomAppsRunning)
  const appsRunningWindows = useMemo(() => {
    return Object.values(getAppsRunning).sort(
      (a, b) => (a.windowIndex - b.windowIndex)
    )
  }, [getAppsRunning])
  const appsRunningMenu = useMemo(() => {
    return Object.values(getAppsRunning).sort(
      (a, b) => (a.menuIndex - b.menuIndex)
    )
  }, [getAppsRunning])

  const openApp = useCallback(<T extends string>(app: AppRunning<T>) => {
    const appIds = Object.keys(getAppsAvail)
    if (app.appId in appIds) {
      // app is available to open

      // check if app is already running
      const appRunningIds = Object.keys(getAppsRunning)
      if (app.appId in appRunningIds) {
        throw new Error(`App with id ${app.appId} is already running`)
      }

      // open app
      setAppsRunning((draft) => {
        draft = mergeDeep(draft, app)
      })
    } else {
      throw new Error(`App with id ${app.appId} is not available`)
    }
  }, [getAppsAvail, getAppsRunning, setAppsRunning])

  const closeApp = useCallback((appId: (keyof typeof getAppsAvail)) => {
    setAppsAvail((draft) => {
      delete draft[appId]
    })
  }, [setAppsAvail])
  
  return {
    avail: {
      menu: appsAvailMenu,
      object: getAppsAvail,
      add: addAppAvail,
      reorder: reorderAppAvail,
      remove: removeAppAvail,
    },
    running: {
      windows: appsRunningWindows,
      menu: appsRunningMenu,
      object: getAppsRunning,
      open: openApp,
      close: closeApp,
    },
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

export type OpenWindowOsDataForApp = {
  userId: string
}

export type OpenWindowOsDataForRender = {
  userId: string
}

export type OpenWindowOsData = {
  forApp: OpenWindowOsDataForApp
  forRender: OpenWindowOsDataForRender
}

export type OpenWindowAppData = {
  title: string
  windowId: string
} | null

export type OpenWindow = (
  osData: OpenWindowOsData,
) => OpenWindowAppData

export type App = FC<OpenWindowOsData['forApp']>

export type RenderWindowProps = {
  title: string
  windowId: string
  app: React.ReactNode
}

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