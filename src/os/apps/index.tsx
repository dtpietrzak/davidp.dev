'use client'

import { AppsProvider } from '@/os/apps/useApps'
import { useAppsAvailable } from '@/os/apps/Providers/appsAvail'
import { useAppsWindows } from '@/os/apps/Providers/appsWindows'
import { useAppsRunning } from '@/os/apps/Providers/appsRunning'
import { Application, AppComponent, RenderApp, AppAvail } from '@/os/apps/types'
import { Loader } from '@/os/apps/Window/Loader'
import { Window } from '@/os/apps/Window'

export { AppsProvider, useAppsAvailable, useAppsWindows, useAppsRunning, Window, type RenderApp, type Application, type AppComponent, type AppAvail, Loader }