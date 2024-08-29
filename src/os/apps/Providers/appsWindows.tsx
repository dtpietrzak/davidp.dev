'use client'

import { useCallback, useMemo, createContext, useContext, useEffect, useState } from 'react'
import { Updater, useImmer } from 'use-immer'

import { defaultApps } from '@/os/apps/defaults'

import { AppAvail, AppsWindows, AppWindow, WindowLocation,  } from '@/os/apps/types'
import { useSystem } from '@/os/system'
import deepmerge from 'deepmerge'

// add and remove are for way future states
// leaving them here so no change prevents future abilities

type AppsWindowsContext = {
  object: AppsWindows;
  array: AppWindow[];
  opened: AppWindow[];
  reorder: (appId: string, indexRequest: number) => true;
  relocate: (appId: string, location: WindowLocation) => true;
  close: (uaiid: string) => true;
  open: (app: AppAvail, instance: number) => true;
  focus: (uaiid: string) => true;
  refresh: number;
  initialized: boolean;
}
const appsWindowsContext = createContext({
  object: {} as AppsWindows,
  array: [],
  opened: [],
  reorder: () => true,
  relocate: () => true,
  close: () => true,
  open: () => true,
  focus: () => true,
  refresh: -1,
  initialized: false,
} as AppsWindowsContext)
export const useAppsWindows = () => useContext(appsWindowsContext)

export const AppsWindowsProvider = ({ children }: { children: React.ReactNode }) => {
  const system = useSystem()
  const appsWindowsLsKey = `${system.data.user.userId}-windows`

  /**
   * 
   * Apps Avail - Apps Avail - Apps Avail
   * 
   */
  const [appsWindows, _setAppsWindows] = useImmer({} as AppsWindows)
  const [refresh, setRefresh] = useState<number>(0)
  const [initialized, setInitialized] = useState<boolean>(false)

  const setAppsWindows: Updater<AppsWindows> =  useCallback((fn) => {
    _setAppsWindows(fn)
    setRefresh((prev) => prev + 1)
  }, [_setAppsWindows])

  useEffect(() => {
    console.log('appsWindows', appsWindows)

    if (!initialized) {
      setInitialized(true)
      const appsWindowsLs = localStorage.getItem(appsWindowsLsKey)
      if (appsWindowsLs) {
        const appsWindowsFromLs = JSON.parse(appsWindowsLs) as AppsWindows
        setAppsWindows(appsWindowsFromLs)
      } else {
        // if localStorage is empty, then derive from defaultApps
        const defaultAppsWindows: AppsWindows = Object.fromEntries(
          Object.entries(defaultApps)
            .map(([key, value]) => {
              return [`${system.data.user.userId}-${value.appId}-${0 /* instance number */}`, {
                appId: value.appId,
                instanceId: 0,
                width: 400,
                height: 300,
                x: 0,
                y: 0,
                zIndex: value.menuIndex,
                open: false,
                appData: {},
              }]
            })
        )
        setAppsWindows(defaultAppsWindows)
      }
    } else {
      const appsWindowsToLs: AppsWindows = deepmerge({}, appsWindows)
      if (JSON.stringify(appsWindowsToLs) === '{}') {
        return
      }
      localStorage.setItem(appsWindowsLsKey, JSON.stringify(appsWindowsToLs))
    }
  }, [appsWindows, appsWindowsLsKey, initialized, setAppsWindows, system.data.user.userId])

  const appsWindowsArray = useMemo(() => {
    return Object.values(appsWindows).sort((a, b) => a.zIndex - b.zIndex)
  }, [appsWindows])
  const appsWindowsOpened = useMemo(() => {
    return appsWindowsArray.filter(x => x.open)
  }, [appsWindowsArray])

  const reorderAppWindow = useCallback((uaiid: string, indexRequest: number) => {
    const appIndex = appsWindowsArray.findIndex(app => 
      `${system.data.user.userId}-${app.appId}-${app.instanceId}` === uaiid
    )
  
    if (appIndex === -1) {
      throw new Error(`App with id ${uaiid} does not exist`)
    }
  
    const appMoving = appsWindowsArray[appIndex]
    if (appIndex === indexRequest) {
      return true // No changes needed
    }

    setAppsWindows((draft) => {
      // already sorted by zIndex
      const appsWindowsArrayCopy = [...appsWindowsArray]

      // Remove the app from the array
      appsWindowsArrayCopy.splice(appIndex, 1)

      // Insert the app at the new index
      appsWindowsArrayCopy.splice(indexRequest, 0, appMoving)

      // Update the zIndex of all apps
      appsWindowsArrayCopy.forEach((app, index) => {
        draft[`${system.data.user.userId}-${app.appId}-${app.instanceId}`] = {
          ...app,
          zIndex: index,
        }
      })
    })
  
    return true
  }, [appsWindowsArray, setAppsWindows, system.data.user.userId])

  const relocateAppWindow = useCallback((
    uaiid: string, location: WindowLocation,
  ) => {
    setAppsWindows((draft) => {
      draft[uaiid].x = location.x
      draft[uaiid].y = location.y
      draft[uaiid].width = location.width
      draft[uaiid].height = location.height
    })
    return true
  }, [setAppsWindows])

  const closeAppWindow = useCallback((uaiid: string) => {
    setAppsWindows((draft) => {
      draft[uaiid].open = false
    })
    return true
  }, [setAppsWindows])

  const openAppWindow = useCallback((app: AppAvail, instanceId: number) => {
    setAppsWindows((draft) => {
      const uaiid = `${system.data.user.userId}-${app.appId}-${instanceId}`

      let zIndex = 0

      Object.values(draft).forEach((appWindow) => {
        if (appWindow.zIndex >= zIndex) {
          zIndex = appWindow.zIndex + 1
        }
      })

      if (draft[uaiid]) {
        draft[uaiid].open = true
        draft[uaiid].zIndex = zIndex
        return
      }

      if (instanceId > 0) {
        // highest zIndex of matching running instances
        const mostRecentlyFocusedCousinInstance = Object.values(draft)
          .filter((appWindow) => appWindow.appId === app.appId)
          .sort((a, b) => a.zIndex - b.zIndex)
          .pop()

        if (mostRecentlyFocusedCousinInstance) {
          const newApp: AppWindow = {
            appId: app.appId,
            instanceId: instanceId,
            width: mostRecentlyFocusedCousinInstance.width,
            height: mostRecentlyFocusedCousinInstance.height,
            x: mostRecentlyFocusedCousinInstance.x + 20,
            y: mostRecentlyFocusedCousinInstance.y + 20,
            zIndex: zIndex,
            open: true,
            appData: {},
          }
          draft[uaiid] = newApp
          return
        }
      }

      const newApp: AppWindow = {
        appId: app.appId,
        instanceId: instanceId,
        width: 400,
        height: 300,
        x: 0,
        y: 0,
        zIndex: zIndex,
        open: true,
        appData: {},
      }
      draft[uaiid] = newApp
    })
    return true
  }, [setAppsWindows, system.data.user.userId])


  const focusAppWindow = useCallback((uaiid: string) => {
    const windowsCount = appsWindowsArray.length
    reorderAppWindow(uaiid, windowsCount)
    return true
  }, [appsWindowsArray.length, reorderAppWindow])


  const appsWindowsValue = useMemo(() => {
    return {
      object: appsWindows,
      array: appsWindowsArray,
      opened: appsWindowsOpened,
      reorder: reorderAppWindow,
      relocate: relocateAppWindow,
      open: openAppWindow,
      close: closeAppWindow,
      focus: focusAppWindow,
      refresh: refresh,
      initialized: initialized,
    }
  }, [appsWindows, appsWindowsArray, appsWindowsOpened, closeAppWindow, focusAppWindow, initialized, openAppWindow, refresh, relocateAppWindow, reorderAppWindow])

  return (
    <appsWindowsContext.Provider value={appsWindowsValue}>
      {children}
    </appsWindowsContext.Provider>
  )
}