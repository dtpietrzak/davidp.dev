import { fileExplorer } from '@/apps/FileExplorer/app'
import { textEditor } from '@/apps/TextEditor/app'
import { systemInformation } from '@/apps/SystemInformation/app'
import { AppsAvail } from '@/os/apps/types'

const defaultWindowLocation = {
  x: 100,
  y: 100,
  width: 800,
  height: 600,
}
let defaultIndex = 0

const getDefaults = () => {
  defaultIndex++
  return {
    sync: false,
    menuIndex: defaultIndex,
    ...defaultWindowLocation,
  }
}

const defaultAppIds: string[] = [
  'file-explorer',
  'text-editor',
  'web-browser',
  'system-information',
]

export const defaultApps: AppsAvail = {
  'file-explorer': {
    ...fileExplorer,
    ...getDefaults(),
  },
  'text-editor': {
    ...textEditor,
    ...getDefaults(),
  },
  'web-browser': {
    ...fileExplorer,
    ...getDefaults(),
    appId: 'web-browser',
    title: 'Web Browser',
  },
  'system-information': {
    ...systemInformation,
    ...getDefaults(),
    multiInstance: true,
  },
}
