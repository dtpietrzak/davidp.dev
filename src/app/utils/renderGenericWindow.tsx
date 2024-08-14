import React from 'react'
import { createRoot } from 'react-dom/client'
import { Window } from '@/app/components/Window'

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