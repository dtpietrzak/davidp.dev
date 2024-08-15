"use client"

import { atom } from "jotai"
import { useImmerAtom } from "jotai-immer"
import { mergeDeep } from "immutable"
import { defaultSystem } from "@/os/system/defaults"
import { System, SystemSettings, SystemUser } from "@/os/system/types"

const systemAtom = atom<System>(defaultSystem)

export const useSystem = () => {
  const [get, set] = useImmerAtom(systemAtom)

  const updateSettings = (partialSettings: Partial<SystemSettings>) => {
    set((draft) => {
      draft.settings = mergeDeep(draft.settings, partialSettings)
    })
  }

  const updateUser = (partialUser: Partial<SystemUser>) => {
    if (partialUser.id) {
      throw new Error("Cannot update user id")
    }
    set((draft) => {
      draft.user = mergeDeep(draft.user, partialUser)
    })
  }

  const login = () => {
    const user = defaultSystem.user
    set((draft) => {
      draft.user = user
    })
  }

  const logout = () => {
    set((draft) => {
      draft = defaultSystem
    })
  }
  
  return {
    system: get,
    updateSettings: updateSettings,
    updateUser: updateUser,
    login: login,
    logout: logout,
  }
}