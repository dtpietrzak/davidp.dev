"use client"

import { useState } from "react"

import { ScrollBar } from "@/components/ScrollBar"
import { App, renderWindow } from "@/os/apps"

export const openTextEditor = () => {
  return renderWindow({
    title: 'Text Editor',
    appId: 'text-editor',
    instanceId: 0,
    userId: 'guest',
    app: (props) => <TextEditor {...props} />,
  })
}

export const TextEditor: App = (osData) => {
  const [text, setText] = useState<string>("")

  return (
    <ScrollBar>
      <textarea
        className={'flex w-full h-full resize-none bg-gray-500/100 rounded-lg outline-none p-2'}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value)
        }}
      />
    </ScrollBar>
  )
}