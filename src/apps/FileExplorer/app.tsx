'use client'

import dynamic from 'next/dynamic'
import { Loader, type Application } from '@/os/apps'

const FileExplorer = dynamic(() => (
  import('./FileExplorer').then((mod) => mod.FileExplorer)
), {
  loading: () => <Loader />,
  ssr: false,
})

export const fileExplorer: Application = {
  title: 'File Explorer',
  icon: '',
  multiInstance: false,
  appId: 'file-explorer',
  app: (systemData) => <FileExplorer {...systemData} />,
}