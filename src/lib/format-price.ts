export function formatPrice(euros: number, fractionDigits = euros % 1 === 0 ? 0 : 2) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(euros)
}
