"use client"

import { useState } from "react"
import { Application } from "@/os/apps"

import { ScrollBar } from "@/components/ScrollBar"

export const textEditor: Application = {
  title: "Text Editor",
  icon: "",
  multiInstance: false,
  appId: "text-editor",
  app: (systemData) => <TextEditor />,
}

const TextEditor = () => {
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