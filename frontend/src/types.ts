export interface Book {
  id: string;
  title: string;
  author: string;
  priceCents: number;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export type SortOrder = 'default' | 'price-asc' | 'price-desc' | 'title';

export type Route = 'about' | 'catalog' | 'cart';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';
