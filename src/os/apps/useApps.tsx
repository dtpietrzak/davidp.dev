"use client"

import { atom, useAtom } from "jotai"
import { useImmerAtom } from "jotai-immer"
import { mergeDeep } from "immutable"
import { App } from "@/os/apps/types"
import { defaultApps } from "@/os/apps/defaults"
import { useMemo } from "react"

const appsAtom = atom(defaultApps)

export const useApps = () => {
  const [get, set] = useImmerAtom(appsAtom)

  const appsArray = useMemo(() => {
    return Object.values(get)
  }, [get])

  const addApp = <T extends string>(app: App<T>) => {
    const appIds = Object.keys(get)
    if (app.appId in appIds) {
      throw new Error(`App with id ${app.appId} already exists`)
    }

    set((draft) => {
      draft = mergeDeep(draft, app)
    })
  }

  const removeApp = (appId: (keyof typeof get)) => {
    set((draft) => {
      delete draft[appId]
    })
  }
  
  return {
    appsObj: get,
    appsArr: appsArray,
    addApp: addApp,
    removeApp: removeApp,
  }
}