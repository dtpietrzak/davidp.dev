'use client'

import { Application } from '@/os/apps'
import { useAsyncEffect } from 'ahooks'
import { useState } from 'react'

export const systemInformation: Application = {
  title: 'System Information',
  icon: '',
  multiInstance: false,
  appId: 'system-information',
  app: (systemData) => <SystemInformation />,
}

type DataItem = Record<string, React.ReactNode>

const orUnknown = (value: any) => {
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return typeof value === 'undefined' ? 'unknown' : value
}

const SystemInformation = () => {
  const [noPermRequiredData, setNoPermRequiredData] = useState<DataItem | null>(null)
  const [locationInfo, setLocationInfo] = useState<DataItem | null>(null)

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
  // https://developer.mozilla.org/en-US/docs/Web/API/StorageManager
  // https://developer.mozilla.org/en-US/docs/Web/API/USB
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getGamepads


  useAsyncEffect(async () => {
    const navigatorUntyped = navigator as any

    setNoPermRequiredData({
      'Cookies Enabled': orUnknown(navigatorUntyped?.cookieEnabled),
      'Device Memory': orUnknown(navigatorUntyped?.deviceMemory),
      'Hardware Concurrency': orUnknown(navigatorUntyped?.hardwareConcurrency),
      'Language': orUnknown(navigatorUntyped?.language),
      'Max Touch Points': orUnknown(navigatorUntyped?.maxTouchPoints),
      'Online': orUnknown(navigatorUntyped?.onLine),
      'PDF Viewer Enabled': orUnknown(navigatorUntyped?.pdfViewerEnabled),
      'User Agent': orUnknown(navigatorUntyped?.userAgent),
      'Web Driver': orUnknown(navigatorUntyped?.webdriver),
    })
  }, [])

  const getLocationInfo = () => {
    navigator?.geolocation.getCurrentPosition((success) => {
      if (!success) {
        setLocationInfo({
          'Failure': 'Unable to get location information',
        })
        return
      }
      setLocationInfo({
        'Accuracy': success.coords.accuracy,
        'Altitude': success.coords.altitude,
        'Altitude Accuracy': success.coords.altitudeAccuracy,
        'Heading': success.coords.heading,
        'Latitude': success.coords.latitude,
        'Longitude': success.coords.longitude,
        'Speed': success.coords.speed,
      })
    })
  }


  const array: any = []

  return (
    <div className="w-full h-full">
      {/* Display information about the users device and browser */}
      <h1>Navigator Information</h1>
      <div className='w-full py-1 px-2'>
        <div className='w-full border rounded-lg'>
          <table className='table-auto w-full'>
            <tbody>
              {
                Object.entries(noPermRequiredData ?? {})
                  .map(([key, value], i) => (
                    <tr key={key} className={`${i !== 0 ? 'border-t' : ''}`}>
                      <td className="font-sm text-right min-w-36 border-r items-start px-2 py-1 align-top">
                        <strong>{key}:</strong>
                      </td>
                      <td className="font-sm px-2 bg-gray-500/40">
                        {value}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
          {}
        </div>
      </div>
    </div>
  )
}