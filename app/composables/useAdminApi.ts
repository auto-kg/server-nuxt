type TelegramWebApp = {
  initData?: string
  ready?: () => void
  expand?: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

const getTelegramWebApp = () => {
  if (!import.meta.client) {
    return undefined
  }

  return window.Telegram?.WebApp
}

export const useAdminApi = () => {
  const getTelegramInitData = () => getTelegramWebApp()?.initData ?? ''

  const readyTelegramWebApp = () => {
    const webApp = getTelegramWebApp()
    webApp?.ready?.()
    webApp?.expand?.()
  }

  const adminFetch = async <T>(url: string, options: any = {}) => {
    const initData = getTelegramInitData()

    return await $fetch<T>(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(initData ? { 'x-telegram-init-data': initData } : {})
      }
    })
  }

  return {
    adminFetch,
    getTelegramInitData,
    readyTelegramWebApp
  }
}
