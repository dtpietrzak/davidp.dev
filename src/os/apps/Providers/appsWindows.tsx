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
                zIndex: 0,
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

  const reorderAppWindow = useCallback((appId: string, indexRequest: number) => {
    for (let i = 0; i < appsWindowsOpened.length; i++) {
      const appMoving = appsWindowsOpened[i]
      if (appMoving.appId === appId) {
        if (appMoving.zIndex === indexRequest) {
          // exit early, no changes needed
          return true
        } else if (appMoving.zIndex < indexRequest) {
          // set appsWindows to newAppsWindows
          setAppsWindows((draft) => {
            // set as requested
            draft[appId].zIndex = indexRequest
            // then go back and shift the in-betweens down
            // no need to go to the end of the array
            // just until you hit the requested index
            for (let j = i + 1; j < indexRequest - 1; j++) {
              draft[appsWindowsOpened[j].appId].zIndex--
            }
          })
          return true
        } else if (appMoving.zIndex > indexRequest) {
          // set appsWindows to newAppsWindows
          setAppsWindows((draft) => {
            // set as requested
            draft[appId].zIndex = indexRequest
            // then go back and shift the rest up
            for (let j = i - 1; j >= 0; j--) {
              draft[appsWindowsOpened[j].appId].zIndex++
            }
          })
          return true
        }
        continue
      }
    }
    // we got here, so the app must not exist!
    throw new Error(`App with id ${appId} does not exist`)
  }, [appsWindowsOpened, setAppsWindows])

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

      const newApp: AppWindow = {
        appId: app.appId,
        instanceId: instanceId,
        width: 400,
        height: 300,
        x: 0,
        y: 0,
        zIndex: 0,
        open: true,
        appData: {},
      }

      draft[uaiid] = newApp
    })
    return true
  }, [setAppsWindows, system.data.user.userId])


  const appsWindowsValue = useMemo(() => {
    return {
      object: appsWindows,
      array: appsWindowsArray,
      opened: appsWindowsOpened,
      reorder: reorderAppWindow,
      relocate: relocateAppWindow,
      open: openAppWindow,
      close: closeAppWindow,
      refresh: refresh,
      initialized: initialized,
    }
  }, [appsWindows, appsWindowsArray, appsWindowsOpened, closeAppWindow, initialized, openAppWindow, refresh, relocateAppWindow, reorderAppWindow])

  return (
    <appsWindowsContext.Provider value={appsWindowsValue}>
      {children}
    </appsWindowsContext.Provider>
  )
}