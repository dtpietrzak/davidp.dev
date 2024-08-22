'use client'

import { useCallback, useMemo } from 'react'

import { atom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'

import { defaultApps } from '@/os/apps/defaults'
import { useSystem } from '@/os/system'

import { AppAvail, AppRunning, AppsAvail, AppsRunning } from '@/os/apps/types'

const atomAppsAvail = atom(defaultApps as AppsAvail)
const atomAppsRunning = atom({} as AppsRunning)
if (process.env.NODE_ENV !== 'production') {
  atomAppsAvail.debugLabel = 'atomAppsAvail'
  atomAppsRunning.debugLabel = 'atomAppsRunning'
}

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
          // set appsAvail to newAppsAvail
          setAppsAvail((draft) => {
            // set as requested
            draft[appId].index = indexRequest
            // then go back and shift the in-betweens down
            // no need to go to the end of the array
            // just until you hit the requested index
            for (let j = i + 1; j < indexRequest - 1; j++) {
              draft[appsAvailMenu[j].appId].index--
            }
          })
          return true
        } else if (appMoving.index > indexRequest) {
          // set appsAvail to newAppsAvail
          setAppsAvail((draft) => {
            // set as requested
            draft[appId].index = indexRequest
            // then go back and shift the rest up
            for (let j = i - 1; j >= 0; j--) {
              draft[appsAvailMenu[j].appId].index++
            }
          })
          return true
        }
        continue
      }
    }
    // we got here, so the app must not exist!
    throw new Error(`App with id ${appId} does not exist`)
  }, [appsAvailMenu, setAppsAvail])

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
    appToRun: Pick<AppAvail, 'appId' | 'title' | 'multiInstance'>,
  ) => {
    const appAvail = getAppsAvail[appToRun['appId']]
    if (appAvail) {
      // app is available to open
      let instanceId = 0

      // is the app multi-instance?
      if (appAvail.multiInstance) {
        const instances: number[] = []
        appsRunningWindows.forEach((appAlreadyRunning) => {
          if (appAlreadyRunning.appId === appToRun.appId) {
            instances.push(appAlreadyRunning.instanceId)
          }
        })
        instances.sort((a, b) => a - b)
        instanceId = instances[instances.length] + 1
      }

      // check if app is already running
      const appIsRunning = appsRunningWindows.some((appRunning) => {
        if (appRunning.appId === appToRun.appId) {
          if (appRunning.instanceId === instanceId) {
            console.warn(`App ${appRunning.appId}-${instanceId} is already running`)
            return true
          }
        }
      })
      if (appIsRunning) return
      
      // app is not already running, boot it up!
      const uaiid = `${system.data.user.userId}-${appToRun.appId}-${instanceId}`

      // open app
      setAppsRunning((draft) => {
        const newApp: AppRunning = {
          ...appToRun,
          instanceId: instanceId,
          uaiid: uaiid,
          menuIndex: 0,
          windowIndex: 0,
          appData: {},
        }

        // shift all indexes up one
        appsRunningWindows.forEach((appAlreadyRunning) => {
          draft[appAlreadyRunning.uaiid].menuIndex++
          draft[appAlreadyRunning.uaiid].windowIndex++
        })

        draft[uaiid] = newApp 
      })
    } else {
      console.error(`App ${appToRun.appId} is not available`)
    }
  }, [appsRunningWindows, getAppsAvail, setAppsRunning, system.data.user.userId])

  const closeApp = useCallback((
    uaiid: string
  ) => {
    setAppsRunning((draft) => {
      delete draft[uaiid]
    })
  }, [setAppsRunning])

  
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
