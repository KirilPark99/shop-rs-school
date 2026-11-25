import { describe, it, expect } from 'vitest';
import { escapeHtml, formatPrice, pluralize } from './format';

describe('formatPrice', () => {
  it('formats cents as dollars', () => {
    expect(formatPrice(1299)).toBe('$12.99');
  });

  it('keeps two decimals', () => {
    expect(formatPrice(850)).toBe('$8.50');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats the cart total from the plan', () => {
    expect(formatPrice(3448)).toBe('$34.48');
  });
});

describe('pluralize', () => {
  const forms: [string, string, string] = ['книга', 'книги', 'книг'];

  it('uses the first form for 1 and 21', () => {
    expect(pluralize(1, forms)).toBe('1 книга');
    expect(pluralize(21, forms)).toBe('21 книга');
  });

  it('uses the second form for 2–4', () => {
    expect(pluralize(4, forms)).toBe('4 книги');
  });

  it('uses the third form for 0, 5 and 11–14', () => {
    expect(pluralize(0, forms)).toBe('0 книг');
    expect(pluralize(5, forms)).toBe('5 книг');
    expect(pluralize(12, forms)).toBe('12 книг');
  });
});

describe('escapeHtml', () => {
  it('escapes special characters', () => {
    expect(escapeHtml('<b>"Tom" & \'Jerry\'</b>')).toBe(
      '&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;',
    );
  });
});
