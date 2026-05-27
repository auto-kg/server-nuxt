export const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-KG', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price)

export const formatMileage = (mileage: number) => `${new Intl.NumberFormat('ru-KG').format(mileage)} км`
