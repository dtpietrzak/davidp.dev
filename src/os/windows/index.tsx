"use client"

import { FC } from "react"
import { createRoot } from "react-dom/client"

import { Window } from "@/os/windows/Window"
import { useWindows, WindowsProvider } from "@/os/windows/useWindows"

import { OpenWindowOsData } from "@/os/windows/types"

export { Window, useWindows, WindowsProvider }

type OpenWindowAppData = {
  title: string
  windowId: string
} | null

export type OpenWindow = (
  osData: OpenWindowOsData,
) => OpenWindowAppData

export type App = FC<OpenWindowOsData['forApp']>

type RenderWindowProps = {
  title: string
  windowId: string
  app: React.ReactNode
}

export const renderWindow = (
  { title, windowId, app }: RenderWindowProps,
  forRender: OpenWindowOsData['forRender'],
): OpenWindowAppData | null => {
  const element = document.getElementById(windowId) ?? document.createElement('div')
  element.id = windowId

  const main = document.getElementById('main')
  if (!main) return null
  main.appendChild(element)

  const componentRoot = createRoot(element)
  componentRoot.render(
    <Window
      title={title}
      windowId={windowId}
      userId={forRender.userId}
    >
      { app }
    </Window>
  )

  return {
    title: title,
    windowId: windowId,
  }
}







// temp
export const renderGenericWindow = (
  title: string,
  windowId: string,
  child: React.ReactNode,
) => {
  const fileExplorerElement = document.getElementById(windowId) ?? document.createElement('div')
  fileExplorerElement.id = windowId

  const main = document.getElementById('main')
  main?.appendChild(fileExplorerElement)

  const fileExplorerComponent = createRoot(fileExplorerElement)
  fileExplorerComponent.render(
    <Window
      title={title}
      userId="guest"
      windowId={windowId}
    >
      {child}
    </Window>
  )
}