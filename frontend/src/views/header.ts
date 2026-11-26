import type { AppState } from '../state';
import type { Route } from '../types';
import { countCopies } from '../cart';

const links: { route: Route; label: string }[] = [
  { route: 'about', label: 'О нас' },
  { route: 'catalog', label: 'Каталог' },
  { route: 'cart', label: 'Корзина' },
];

export function renderHeader(state: AppState): string {
  const copies = countCopies(state.cart);
  const items = links
    .map(({ route, label }) => {
      const active = state.route === route;
      const text = route === 'cart' ? `${label} · <span data-cart-count>${copies}</span>` : label;
      return `<a class="nav__link${active ? ' is-active' : ''}" href="#${route}"
        ${active ? 'aria-current="page"' : ''}>${text}</a>`;
    })
    .join('');

  return `
    <header class="header">
      <a class="logo" href="#about">
        <span class="logo__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 5.5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 6.5v13"/>
          </svg>
        </span>
        <span class="logo__text">Книжная полка</span>
      </a>
      <nav class="nav" aria-label="Главное меню">${items}</nav>
    </header>`;
}
