import { System, SystemSettings, SystemUser } from '@/os/system/types'

const defaultUserSettings: SystemSettings = {
  theme: {
    value: 'dark',
    sync: false,
  },
  controlBarLocation: {
    value: 'right',
    sync: false,
  }
}

const defaultUser: SystemUser = {
  userId: 'guest',
  name: 'Guest',
  image: undefined,
}

export const defaultSystem: System = {
  settings: defaultUserSettings,
  user: defaultUser,
}