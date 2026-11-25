import { mockBooks } from './mock-books';
import { formatPrice } from './format';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>Книжная полка</h1>
  <ul>
    ${mockBooks.map((b) => `<li>${b.title} — ${formatPrice(b.priceCents)}</li>`).join('')}
  </ul>
`;
