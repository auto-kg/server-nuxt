export const normalizeDictionaryValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]/gi, '')

export const brandAliases: Record<string, string> = {
  benz: 'Mercedes-Benz',
  mercedes: 'Mercedes-Benz',
  mercedesbenz: 'Mercedes-Benz',
  mers: 'Mercedes-Benz',
  мерс: 'Mercedes-Benz',
  мерседес: 'Mercedes-Benz',
  toyoota: 'Toyota',
  tayota: 'Toyota',
  тоета: 'Toyota',
  тайота: 'Toyota'
}

export const normalizeBrandName = (brand: string) => {
  const key = normalizeDictionaryValue(brand)
  return brandAliases[key] ?? brand.trim()
}
