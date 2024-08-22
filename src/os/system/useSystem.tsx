'use client'

import { atom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import { mergeDeep } from 'immutable'
import { defaultSystem } from '@/os/system/defaults'
import { System, SystemSettings, SystemUser } from '@/os/system/types'
import { useEffect } from 'react'

const systemAtom = atom<System>(defaultSystem)

export const useSystem = () => {
  const [get, set] = useImmerAtom(systemAtom)

  useEffect(() => {
    // const windowState = localStorage.getItem(`${get.user.userId}-windowState`)
    // Object.values(JSON.parse(windowState ?? "{}")).forEach((_window: any) => {
    //   windowManager.openWindow(_window.windowId, get.user)
    // })
  }, [get.user, get.user.userId])

  const updateSettings = (partialSettings: Partial<SystemSettings>) => {
    set((draft) => {
      draft.settings = mergeDeep(draft.settings, partialSettings)
    })
  }

  const updateUser = (partialUser: Partial<SystemUser>) => {
    if (partialUser.userId) {
      throw new Error('Cannot update user id')
    }
    set((draft) => {
      draft.user = mergeDeep(draft.user, partialUser)
    })
  }

  // temporary login function
  const login = (newUser: SystemUser) => {
    set((draft) => {
      draft.user = newUser
    })
  }

  const logout = () => {
    set((draft) => {
      draft.user = defaultSystem.user
      draft.settings = defaultSystem.settings
    })
  }
  
  return {
    data: get,
    updateSettings: updateSettings,
    updateUser: updateUser,
    login: login,
    logout: logout,
  }
}