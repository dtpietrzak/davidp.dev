import { fileExplorer } from '@/apps/FileExplorer/app'
import { textEditor } from '@/apps/TextEditor/app'
import { systemInformation } from '@/apps/SystemInformation/app'
import { AppsAvail } from '@/os/apps/types'

export const defaultApps: AppsAvail = {
  'file-explorer': {
    ...fileExplorer,
    sync: false,
    index: 0,
  },
  'text-editor': {
    ...textEditor,
    sync: false,
    index: 1,
  },
  'web-browser': {
    ...fileExplorer,
    sync: false,
    index: 0,
    appId: 'web-browser',
    title: 'Web Browser',
  },
  'system-information': {
    ...systemInformation,
    sync: false,
    index: 2,
  },
}