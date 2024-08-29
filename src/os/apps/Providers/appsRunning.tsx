'use client'

import { useCallback, useMemo, createContext, useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import { useSystem } from '@/os/system'

import { AppAvail, AppRunning, AppsRunning } from '@/os/apps/types'
import { useAppsAvailable } from '@/os/apps/Providers/appsAvail'
import { useAppsWindows } from '@/os/apps/Providers/appsWindows'

type AppsRunningContext = {
  object: AppsRunning;
  array: AppRunning[];
  open: (appToRun: Pick<AppAvail, 'appId' | 'title' | 'multiInstance'>) => void;
  close: (uaiid: string) => void;
}
const appsRunningContext = createContext({
  object: {},
  array: [],
  open: () => {},
  close: () => {},
} as AppsRunningContext)
export const useAppsRunning = () => useContext(appsRunningContext)

let initialized = false

export const AppsRunningProvider = ({ children }: { children: React.ReactNode }) => {
  const system = useSystem()
  const appsAvailable = useAppsAvailable()
  const appsWindows = useAppsWindows()

  /**
   * 
   * Apps Running - Apps Running - Apps Running
   * 
   */
  const [appsRunning, setAppsRunning] = useImmer({} as AppsRunning)
  useEffect(() => {
    if (initialized && appsWindows.initialized) {

    } else {
      if (appsWindows.initialized) {
        initialized = true
        const appsRunningFromWindows: AppRunning[] = appsWindows.opened
          .map((appWindow) => {
            const appAvail = appsAvailable.object[appWindow.appId]
            if (appAvail) {
              return {
                uaiid: `${system.data.user.userId}-${appWindow.appId}-${appWindow.instanceId}`,
                appId: appWindow.appId,
                instanceId: appWindow.instanceId,
                multiInstance: appAvail.multiInstance,
                appData: {},
                menuIndex: 0,
                title: appAvail.title,
              } as AppRunning
            }
          }).filter(Boolean) as AppRunning[]

        setAppsRunning((draft) => {
          appsRunningFromWindows.forEach((appRunning) => {
            draft[appRunning.uaiid] = appRunning
          })
        })
      }
    }
  }, [appsAvailable.object, appsWindows.initialized, appsWindows.opened, setAppsRunning, system.data.user.userId, appsWindows])

  const appsRunningMenu = useMemo(() => {
    return Object.values(appsRunning).sort(
      (a, b) => (a.menuIndex - b.menuIndex)
    )
  }, [appsRunning])

  const openApp = useCallback((
    appToRun: Pick<AppAvail, 'appId' | 'title' | 'multiInstance'>,
  ) => {
    const appAvail = appsAvailable.object[appToRun['appId']]
    if (appAvail) {
      // app is available to open
      let instanceId = 0

      // is the app multi-instance?
      if (appAvail.multiInstance) {
        const instances: number[] = []
        appsRunningMenu.forEach((appAlreadyRunning) => {
          if (appAlreadyRunning.appId === appToRun.appId) {
            instances.push(appAlreadyRunning.instanceId)
          }
        })

        if (instances.length === 0) {
          instanceId = 0
        } else {
          instances.sort((a, b) => a - b)
          instanceId = instances[instances.length - 1] + 1
          if (Number.isNaN(instanceId)) {
            instanceId = 0
          }
        }
      }

      // check if app is already running
      const appIsRunning = appsRunningMenu.some((appRunning) => {
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

      // open app window
      appsWindows.open(appAvail, instanceId)

      // open app
      setAppsRunning((draft) => {
        const newApp: AppRunning = {
          ...appToRun,
          instanceId: instanceId,
          uaiid: uaiid,
          menuIndex: 0,
          appData: {},
        }

        // shift all indexes up one
        appsRunningMenu.forEach((appAlreadyRunning) => {
          draft[appAlreadyRunning.uaiid].menuIndex++
        })

        draft[uaiid] = newApp 
      })
    } else {
      console.error(`App ${appToRun.appId} is not available`)
    }
  }, [appsAvailable.object, appsRunningMenu, system.data.user.userId, appsWindows, setAppsRunning])

  const closeApp = useCallback((
    uaiid: string
  ) => {
    // close app window
    appsWindows.close(uaiid)

    setAppsRunning((draft) => {
      delete draft[uaiid]
    })
  }, [appsWindows, setAppsRunning])

  const appsRunningValue = useMemo(() => {
    return {
      object: appsRunning,
      array: appsRunningMenu,
      open: openApp,
      close: closeApp,
    }
  }, [appsRunningMenu, appsRunning, openApp, closeApp])

  return (
    <appsRunningContext.Provider value={appsRunningValue}>
      {children}
    </appsRunningContext.Provider>
  )
}