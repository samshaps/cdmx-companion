export function formatMoney(amount, currency, { decimals = 2 } = {}) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  } catch {
    return `${amount.toFixed(decimals)} ${currency}`
  }
}

export function currencySymbol(currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency })
      .formatToParts(0)
      .find(p => p.type === 'currency').value
  } catch {
    return currency
  }
}
