type TelegramWebApp = {
  initData?: string
  ready?: () => void
  expand?: () => void
  BackButton?: {
    show?: () => void
    hide?: () => void
    onClick?: (callback: () => void) => void
    offClick?: (callback: () => void) => void
  }
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

  const waitForTelegramInitData = async (timeoutMs = 1500) => {
    if (!import.meta.client) {
      return ''
    }

    const startedAt = Date.now()

    while (Date.now() - startedAt < timeoutMs) {
      const initData = getTelegramInitData()

      if (initData) {
        return initData
      }

      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    return getTelegramInitData()
  }

  const readyTelegramWebApp = () => {
    const webApp = getTelegramWebApp()
    webApp?.ready?.()
    webApp?.expand?.()
  }

  const adminFetch = async <T>(url: string, options: any = {}) => {
    const initData = await waitForTelegramInitData()

    if (!initData) {
      throw new Error('Откройте админку через Telegram бота.')
    }

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
    waitForTelegramInitData,
    readyTelegramWebApp
  }
}
