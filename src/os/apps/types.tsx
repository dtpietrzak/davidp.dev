export type App<T extends string> = {
  appId: T
  title: string
  icon: string
  index: number
  sync: boolean
} 
export type Apps<T extends string> = Record<T, App<T>> 