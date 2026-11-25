export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// pluralize(3, ['книга', 'книги', 'книг']) -> '3 книги'
export function pluralize(count: number, forms: [string, string, string]): string {
  const lastTwo = Math.abs(count) % 100;
  const last = lastTwo % 10;
  let form = forms[2];
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) form = forms[0];
    else if (last >= 2 && last <= 4) form = forms[1];
  }
  return `${count} ${form}`;
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
