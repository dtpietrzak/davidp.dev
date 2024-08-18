import { fileExplorer } from "@/apps/FileExplorer/app"
import { textEditor } from "@/apps/TextEditor/app"
import { AppsAvail } from "@/os/apps/types"

export const defaultApps: AppsAvail = {
  "file-explorer": {
    ...fileExplorer,
    sync: false,
    index: 0,
  },
  "text-editor": {
    ...textEditor,
    sync: false,
    index: 1,
  },
  "web-browser": {
    ...fileExplorer,
    sync: false,
    index: 0,
    appId: 'web-browser',
    title: 'Web Browser',
  },
  "system-information": {
    ...fileExplorer,
    sync: false,
    index: 0,
    appId: 'system-information',
    title: 'System Information',
  },
}