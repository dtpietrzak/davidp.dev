'use client'

import { useApps } from '@/os/apps'
import { RenderApp, Window } from '@/os/apps'
import { AppRunning } from '@/os/apps/types'
import { useSystem } from '@/os/system'

import { FileExplorer } from '@/apps/FileExplorer/FileExplorer'

export default function Desktop() {
  const system = useSystem()
  const apps = useApps()

  return (
    <main id="main">
      {
        apps.running.windows.map((app: AppRunning) => {
          return (
            <Window
              key={app.uaiid}
              uaiid={app.uaiid}
              title={app.title}
            >
              {
                apps.avail.object[app.appId].app({
                  controlBarLocation: system.data.settings.controlBarLocation,
                  theme: system.data.settings.theme,
                  userId: system.data.user.userId,
                })
              }
            </Window>
          )
        })
      }
    </main>
  )
}

// const AppInWindow = renderAppInWindow({
//   title: appToRun.title,
//   uaiid: uaiid,
//   app: getAppsAvail[appToRun.appId].app,
// }, {
//   controlBarLocation: system.settings.controlBarLocation,
//   theme: system.settings.theme,
//   userId: system.user.userId,
// })

// const renderAppInWindow: RenderApp = ({ 
//   title, uaiid, app,
// }, systemData) => {
//   return (
//     <Window
//       title={title}
//       uaiid={uaiid}
//     >
//       { app(systemData) }
//     </Window>
//   )
// }