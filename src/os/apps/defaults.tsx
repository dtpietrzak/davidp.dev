import { FileExplorer } from "@/apps/FileExplorer/app"
import { TextEditor } from "@/apps/TextEditor/app"
import { AppId, AppsAvail } from "@/os/apps/types"

export const defaultApps: AppsAvail<AppId> = {
  "file-explorer": {
    title: "File Explorer",
    icon: "",
    multiInstance: false,
    appId: "file-explorer",
    sync: false,
    index: 0,
    app: FileExplorer,
  },
  "text-editor": {
    title: "Text Editor",
    icon: "",
    multiInstance: false,
    appId: "text-editor",
    sync: false,
    index: 0,
    app: TextEditor,
  },
  "web-browser": {
    title: "Web Browser",
    icon: "",
    multiInstance: false,
    appId: "web-browser",
    sync: false,
    index: 0,
    app: TextEditor,
  },
  "system-information": {
    title: "System Information",
    icon: "",
    multiInstance: false,
    appId: "system-information",
    sync: false,
    index: 0,
    app: TextEditor,
  },
}