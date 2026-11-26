import type { Book, CartItem, LoadStatus, Route, SortOrder } from './types';

export interface AppState {
  route: Route;
  books: Book[];
  booksStatus: LoadStatus;
  cart: CartItem[];
  totalStatus: LoadStatus;
  totalCents: number;
  query: string;
  sort: SortOrder;
}
