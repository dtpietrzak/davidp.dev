'use client'

import { AppsAvailProvider } from '@/os/apps/Providers/appsAvail'
import { AppsRunningProvider } from '@/os/apps/Providers/appsRunning'
import { AppsWindowsProvider } from '@/os/apps/Providers/appsWindows'

const isInitialized = false

export const AppsProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <AppsAvailProvider>
      <AppsWindowsProvider>
        <AppsRunningProvider>
          {children}
        </AppsRunningProvider>
      </AppsWindowsProvider>
    </AppsAvailProvider>
  )
}