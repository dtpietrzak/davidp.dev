'use client'

import { AppComponent } from '@/os/apps'
import { useSystem } from '@/os/system'

export const FileExplorer: AppComponent = () => {
  return (
    <div>
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
    </div>
  )
}