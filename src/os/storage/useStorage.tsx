'use client'

import { atom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import { mergeDeep } from 'immutable'

// export const useStorage = () => {

//   const toSave = (data: any) => {
//     return JSON.stringify(data)
//   }

//   const saveSystem = (system: System) => {
//     try {
//       // localStorage

//       const saveId = system.user.userId + "-system"
//       const saveData = toSave(system)

//       localStorage.setItem(saveId, saveData)

//     } catch (error) {
//       console.error("Failed to save to localStorage", error)
//     }

//     try {
//       // TODO: server
//     } catch (error) {
//       console.error("Failed to save to server", error)
//     }
//   }
// }
















