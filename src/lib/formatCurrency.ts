export function formatCurrency(
  amount: number,
  currencyCode: string = 'GBP'
): string {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(amount);
  } catch (error) {
    // fallback formatting if currency code is invalid
    console.error('invalid currency code:', currencyCode, error);
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
