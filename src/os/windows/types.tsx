import { FC } from "react"

export type OpenWindowOsDataForApp = {
  userId: string
}

export type OpenWindowOsDataForRender = {
  userId: string
}

export type OpenWindowOsData = {
  forApp: OpenWindowOsDataForApp
  forRender: OpenWindowOsDataForRender
}

export type OpenWindowAppData = {
  title: string
  windowId: string
} | null

export type OpenWindow = (
  osData: OpenWindowOsData,
) => OpenWindowAppData

export type App = FC<OpenWindowOsData['forApp']>

export type RenderWindowProps = {
  title: string
  windowId: string
  app: React.ReactNode
}