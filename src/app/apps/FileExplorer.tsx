import { ScrollBar } from "@/app/components/ScrollBar"
import { Window } from "@/app/components/Window"
import { createRoot } from "react-dom/client"

export const FileExplorer = () => {
  return (
    <ScrollBar>
      <h1 className="font-5xl mb-2">
        This is a file explorer. 5xl
      </h1>
      <h1 className="font-4xl mb-2">
        This is a file explorer. 4xl
      </h1>
      <h1 className="font-3xl mb-2">
        This is a file explorer. 3xl
      </h1>
      <h1 className="font-2xl mb-2">
        This is a file explorer. 2xl
      </h1>
      <h1 className="font-xl mb-2">
        This is a file explorer. xl
      </h1>
      <h2 className="font-lg mb-2">
        It is draggable and resizable. lg
      </h2>
      <p className="font-md mb-2">
        This is a file explorer. It is draggable and resizable. It is also closable. It is also draggable and resizable on mobile. It is also closable on mobile. md
      </p>
      <p className="font-sm mb-2">
        It is also closable. It is also draggable and resizable on mobile. It is also closable on mobile. sm
      </p>
      <p className="font-xs mb-2">
        It is also closable. It is also draggable and resizable on mobile. It is also closable on mobile. This is a file explorer. It is draggable and resizable. It is also closable. It is also draggable and resizable on mobile. It is also closable on mobile. xs
      </p>
      <p className="font-xxs mb-2">
        It is also closable. It is also draggable and resizable on mobile. It is also closable on mobile. This is a file explorer. It is draggable and resizable. It is also closable. It is also draggable and resizable on mobile. It is also closable on mobile. xxs
      </p>
    </ScrollBar>
  )
}

export const initializeComponent = (
  windowId: string,
) => {
  const element = document.getElementById(windowId) ?? document.createElement('div')
  element.id = windowId

  const main = document.getElementById('main')
  if (!main) return null
  main.appendChild(element)

  const componentRoot = createRoot(element)
  return componentRoot
}

export const openWindow() => {
  
}

export const renderFileExplorer = () => {
  const fileExplorerComponent = initializeComponent('file-explorer')
  fileExplorerComponent.render(
    <Window
      title="File Explorer"
      userId="guest"
      windowId="file-explorer"
    >
      <FileExplorer />
    </Window>
  )
}