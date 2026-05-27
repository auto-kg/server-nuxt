const storageKey = 'autohub:favorites'

export const useFavorites = () => {
  const favoriteIds = useState<string[]>('favorite-ids', () => [])

  const loadFavorites = () => {
    if (!import.meta.client) {
      return
    }

    try {
      favoriteIds.value = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    } catch {
      favoriteIds.value = []
    }
  }

  const persistFavorites = () => {
    if (import.meta.client) {
      localStorage.setItem(storageKey, JSON.stringify(favoriteIds.value))
    }
  }

  const isFavorite = (id: string) => favoriteIds.value.includes(id)

  const toggleFavorite = (id: string) => {
    favoriteIds.value = isFavorite(id)
      ? favoriteIds.value.filter((favoriteId) => favoriteId !== id)
      : [...favoriteIds.value, id]

    persistFavorites()
  }

  return {
    favoriteIds,
    loadFavorites,
    isFavorite,
    toggleFavorite
  }
}
