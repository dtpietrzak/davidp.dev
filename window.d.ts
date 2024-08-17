type WindowManager = {
  openWindow: (appName: AppName, osData: OsData) => void
  closeWindow: (userId: string, windowId: string) => void
  state: Record<string, {
    title: string
    windowId: string
    index: number
  }>
}

interface Window {
  windowManager: WindowManager
}