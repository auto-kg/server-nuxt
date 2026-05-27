const storageKey = 'autohub:recently-viewed'
const maxItems = 12

export const useRecentlyViewed = () => {
  const recentlyViewedIds = useState<string[]>('recently-viewed-ids', () => [])

  const loadRecentlyViewed = () => {
    if (!import.meta.client) {
      return
    }

    try {
      recentlyViewedIds.value = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    } catch {
      recentlyViewedIds.value = []
    }
  }

  const persistRecentlyViewed = () => {
    if (import.meta.client) {
      localStorage.setItem(storageKey, JSON.stringify(recentlyViewedIds.value))
    }
  }

  const addRecentlyViewed = (id: string) => {
    recentlyViewedIds.value = [
      id,
      ...recentlyViewedIds.value.filter((currentId) => currentId !== id)
    ].slice(0, maxItems)

    persistRecentlyViewed()
  }

  return {
    recentlyViewedIds,
    loadRecentlyViewed,
    addRecentlyViewed
  }
}
