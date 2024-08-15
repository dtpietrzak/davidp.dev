type OpenWindowOsDataForApp = {
  userId: string
}

type OpenWindowOsDataForRender = {
  userId: string
}

export type OpenWindowOsData = {
  forApp: OpenWindowOsDataForApp
  forRender: OpenWindowOsDataForRender
}