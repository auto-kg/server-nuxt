type AdminToastType = 'success' | 'error' | 'info'

interface AdminToast {
  id: string
  type: AdminToastType
  title: string
  message?: string
}

export const useAdminToast = () => {
  const toasts = useState<AdminToast[]>('admin-toasts', () => [])

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const pushToast = (toast: Omit<AdminToast, 'id'>, timeoutMs = 4200) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    toasts.value = [
      {
        id,
        ...toast
      },
      ...toasts.value
    ].slice(0, 3)

    if (import.meta.client && timeoutMs > 0) {
      window.setTimeout(() => removeToast(id), timeoutMs)
    }

    return id
  }

  const showSuccess = (title: string, message?: string) => pushToast({ type: 'success', title, message })
  const showError = (title: string, message?: string) => pushToast({ type: 'error', title, message }, 6000)
  const showInfo = (title: string, message?: string) => pushToast({ type: 'info', title, message })

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showInfo
  }
}
