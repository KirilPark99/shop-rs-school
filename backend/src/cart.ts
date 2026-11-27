export function calculateCartTotal(
  items: unknown,
  books: readonly { id: string; priceCents: number }[],
): number | 'INVALID_CART' | 'UNKNOWN_BOOK' {
  if (!Array.isArray(items)) return 'INVALID_CART';

  const cart: unknown[] = items;
  let total = 0;
  for (const item of cart) {
    if (typeof item !== 'object' || item === null || !('bookId' in item) || !('quantity' in item)) {
      return 'INVALID_CART';
    }

    const { bookId, quantity } = item;
    if (typeof bookId !== 'string' || typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 1) {
      return 'INVALID_CART';
    }

    const book = books.find((book) => book.id === bookId);
    if (!book) return 'UNKNOWN_BOOK';

    const lineTotal = book.priceCents * quantity;
    if (!Number.isSafeInteger(lineTotal)) return 'INVALID_CART';
    total += lineTotal;
    if (!Number.isSafeInteger(total)) return 'INVALID_CART';
  }
  return total;
}
