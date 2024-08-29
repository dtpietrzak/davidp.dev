'use client'

import { useCallback, useMemo, createContext, useContext } from 'react'
import { useImmer } from 'use-immer'

import { defaultApps } from '@/os/apps/defaults'

import { AppAvail, AppsAvail } from '@/os/apps/types'

// add and remove are for way future states
// leaving them here so no change prevents future abilities

type AppsAvailContext = {
  object: AppsAvail;
  array: AppAvail[];
  reorder: (appId: string, indexRequest: number) => true;
  add: (app: AppAvail) => void;
  remove: (appId: (string)) => void;
}
const appsAvailContext = createContext({
  array: [],
  object: defaultApps as AppsAvail,
  reorder: () => true,
  add: () => {},
  remove: () => {},
} as AppsAvailContext)
export const useAppsAvailable = () => useContext(appsAvailContext)

export const AppsAvailProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * 
   * Apps Avail - Apps Avail - Apps Avail
   * 
   */
  const [appsAvail, setAppsAvail] = useImmer(defaultApps as AppsAvail)
  const appsAvailMenu = useMemo(() => {
    return Object.values(appsAvail).sort((a, b) => a.menuIndex - b.menuIndex)
  }, [appsAvail])

  const addAppAvail = useCallback((app: AppAvail) => {
    const appIds = Object.keys(appsAvail)
    if (app.appId in appIds) {
      throw new Error(`App with id ${app.appId} already exists`)
    }
    setAppsAvail((draft) => {
      draft[app.appId] = app
    })
  }, [appsAvail, setAppsAvail])

  const reorderAppAvail = useCallback((appId: string, indexRequest: number) => {
    for (let i = 0; i < appsAvailMenu.length; i++) {
      const appMoving = appsAvailMenu[i]
      if (appMoving.appId === appId) {
        if (appMoving.menuIndex === indexRequest) {
          // exit early, no changes needed
          return true
        } else if (appMoving.menuIndex < indexRequest) {
          // set appsAvail to newAppsAvail
          setAppsAvail((draft) => {
            // set as requested
            draft[appId].menuIndex = indexRequest
            // then go back and shift the in-betweens down
            // no need to go to the end of the array
            // just until you hit the requested index
            for (let j = i + 1; j < indexRequest - 1; j++) {
              draft[appsAvailMenu[j].appId].menuIndex--
            }
          })
          return true
        } else if (appMoving.menuIndex > indexRequest) {
          // set appsAvail to newAppsAvail
          setAppsAvail((draft) => {
            // set as requested
            draft[appId].menuIndex = indexRequest
            // then go back and shift the rest up
            for (let j = i - 1; j >= 0; j--) {
              draft[appsAvailMenu[j].appId].menuIndex++
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

  const removeAppAvail = useCallback((appId: (keyof typeof appsAvail)) => {
    setAppsAvail((draft) => {
      delete draft[appId]
    })
  }, [setAppsAvail])

  const appsAvailValue = useMemo(() => {
    return {
      object: appsAvail,
      array: appsAvailMenu,
      reorder: reorderAppAvail,
      add: addAppAvail,
      remove: removeAppAvail,
    }
  }, [addAppAvail, appsAvail, appsAvailMenu, removeAppAvail, reorderAppAvail])

  return (
    <appsAvailContext.Provider value={appsAvailValue}>
      {children}
    </appsAvailContext.Provider>
  )
}