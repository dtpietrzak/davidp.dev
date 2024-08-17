import { AppId, AppsAvail } from "@/os/apps/types"

export const defaultApps: AppsAvail<AppId> = {
  "file-explorer": {
    appId: "file-explorer",
    title: "File Explorer",
    icon: "",
    index: 0,
    sync: false,
  },
  "text-editor": {
    appId: "text-editor",
    title: "Text Editor",
    icon: "",
    index: 1,
    sync: false,
  },
  "web-browser": {
    appId: "web-browser",
    title: "Web Browser",
    icon: "",
    index: 2,
    sync: false,
  },
  "system-information": {
    appId: "system-information",
    title: "System Information",
    icon: "",
    index: 3,
    sync: false,
  },
}