"use client"

import { atom } from "jotai"
import { useImmerAtom } from "jotai-immer"
import { AppAvail, AppId, AppRunning, AppsAvail, AppsRunning } from "@/os/apps/types"
import { defaultApps } from "@/os/apps/defaults"
import { FC, useCallback, useMemo } from "react"
import { Window } from "@/os/apps/Window"
import { createRoot } from "react-dom/client"
import { useSystem } from "@/os/system"

const atomAppsAvail = atom(defaultApps as AppsAvail)
const atomAppsRunning = atom({} as AppsRunning)

export const useApps = () => {
  const system = useSystem()
  /**
   * 
   * Apps Avail - Apps Avail - Apps Avail
   * 
   */
  const [getAppsAvail, setAppsAvail] = useImmerAtom(atomAppsAvail)
  const appsAvailMenu = useMemo(() => {
    return Object.values(getAppsAvail).sort((a, b) => a.index - b.index)
  }, [getAppsAvail])

  const addAppAvail = useCallback((app: AppAvail) => {
    const appIds = Object.keys(getAppsAvail)
    if (app.appId in appIds) {
      throw new Error(`App with id ${app.appId} already exists`)
    }
    setAppsAvail((draft) => {
      draft[app.appId] = app
    })
  }, [getAppsAvail, setAppsAvail])

  const reorderAppAvail = useCallback((appId: string, indexRequest: number) => {
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

  const openApp = useCallback((
    appToRun: Pick<AppRunning, 'appData' | 'appId' | 'instanceId' | 'title'>,
  ) => {
    const appsAvailIds = Object.keys(getAppsAvail)
    console.log("2", appsAvailIds, appToRun.appId)
    if (appsAvailIds.includes(appToRun.appId)) {
      // app is available to open

      // check if app is already running
      appsRunningWindows.forEach((appAlreadyRunning) => {
        if (
          appAlreadyRunning.appId === appToRun.appId &&
          appAlreadyRunning.instanceId === appToRun.instanceId
        ) {
          throw new Error(`App ${appToRun.appId}-${appToRun.instanceId} is already running`)
        }
      })
      // app is not already running, boot it up!
      const newRunningApps = { ...getAppsRunning }
      // shift all indexes up one
      appsRunningWindows.forEach((appAlreadyRunning) => {
        const _id = `${appAlreadyRunning.appId}-${appAlreadyRunning.instanceId}`
        newRunningApps[_id].menuIndex++
        newRunningApps[_id].windowIndex++
      })

      renderWindow({
        title: appToRun.title,
        appId: appToRun.appId,
        instanceId: appToRun.instanceId,
        userId: system.system.user.userId,
        app: getAppsAvail[appToRun.appId as AppId].app,
      })

      const newApp: AppRunning = {
        ...appToRun,
        menuIndex: 0,
        windowIndex: 0,
      }
      // open app
      setAppsRunning((draft) => {
        const _id = `${newApp.appId}-${newApp.instanceId}`
        draft[_id] = newApp 
      })
    } else {
      throw new Error(`App ${appToRun.appId}-${appToRun.instanceId} is not available`)
    }
  }, [appsRunningWindows, getAppsAvail, getAppsRunning, setAppsRunning, system.system.user.userId])

  const closeApp = useCallback((
    appId: (keyof typeof getAppsAvail),
    instanceId: string,
    userId?: string, // need to add user id
  ) => {
    if (typeof window !== 'undefined') {
      const _id = `${appId}-${instanceId}`
      const appToClose = document.getElementById(_id)
      if (appToClose) {
        appToClose.style.display = 'none'
        appToClose.remove()
      }

      setAppsAvail((draft) => {
        delete draft[`${appId}-${instanceId}`]
      })
    }
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
  appId: string
  instanceId: string
} | null

export type OpenWindow = (
  osData: OpenWindowOsData,
) => OpenWindowAppData

export type App = FC<OpenWindowOsData['forApp']>

export type RenderWindowProps = {
  title: string
  appId: string
  instanceId: string
  userId: string
  app: App
}

export const renderWindow = (
  { title, appId, instanceId, userId, app }: RenderWindowProps
) => {
  const _id = `${appId}-${instanceId}`

  if (document.getElementById(_id)) {
    console.error(`${_id} already open`)
    return null
  }

  const element = document.createElement('div')
  element.id = _id

  const main = document.getElementById('main')
  if (!main) return null
  main.appendChild(element)

  const componentRoot = createRoot(element)
  componentRoot.render(
    <Window
      title={title}
      appId={appId}
      instanceId={instanceId}
      userId={userId}
    >
      { app({ userId: userId }) }
    </Window>
  )
}
