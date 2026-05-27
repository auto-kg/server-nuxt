const normalizeWhatsappPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 9) {
    return `996${digits}`
  }

  if (digits.length === 10 && digits.startsWith('0')) {
    return `996${digits.slice(1)}`
  }

  return digits
}

export const buildWhatsappUrl = (phone: string, message: string) => {
  const normalizedPhone = normalizeWhatsappPhone(phone)

  if (!normalizedPhone) {
    return ''
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
}
