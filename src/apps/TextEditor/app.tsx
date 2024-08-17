"use client"

import { useState } from "react"

import { ScrollBar } from "@/components/ScrollBar"
import { App, OpenWindow, renderWindow } from "@/os/windows"
// import { Application } from "@/os/apps"

// export const App: Application = {
//   title: 'File Explorer',
//   multiInstance: false,
//   app: (osData) => <FileExplorer />,
// }

export const openTextEditor: OpenWindow = ({
  forApp, forRender,
}) => {
  return renderWindow({
    title: 'Text Editor',
    windowId: 'text-editor',
    app: <TextEditor {...forApp} />,
  }, forRender)
}

const TextEditor: App = (osData) => {
  const [text, setText] = useState<string>("")

  return (
    <ScrollBar>
      <textarea
        className={'w-full h-full resize-none bg-gray-500/10'}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value)
        }}
      />
    </ScrollBar>
  )
}