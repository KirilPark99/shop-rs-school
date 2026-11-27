import { escapeHtml } from '../format';

// Впишите сюда свои имена или GitHub-логины.
const team = [
  {
    role: 'Фронтенд',
    name: 'Yurechik22',
    contribution: 'Интерфейс, каталог, поиск и сортировка, корзина, подключение API, unit-тесты корзины.',
  },
  {
    role: 'Бэкенд',
    name: 'KirilPark99',
    contribution: 'Данные книг, расчёт стоимости и тесты API.',
  },
];

const heroBooks = [
  { id: 'book-1', title: 'The Hobbit' },
  { id: 'book-3', title: 'Alice’s Adventures in Wonderland' },
  { id: 'book-2', title: 'The Little Prince' },
];

export function renderAbout(): string {
  const covers = heroBooks
    .map(
      (book, i) =>
        `<img class="hero__book hero__book--${i + 1}" src="${import.meta.env.BASE_URL}covers/${book.id}.svg"
          alt="" data-cover-title="${escapeHtml(book.title)}">`,
    )
    .join('');

  const members = team
    .map(
      (member) => `
        <article class="team-card">
          <p class="team-card__role">${escapeHtml(member.role)}</p>
          <h3 class="team-card__name">${escapeHtml(member.name)}</h3>
          <p class="team-card__text">${escapeHtml(member.contribution)}</p>
        </article>`,
    )
    .join('');

  return `
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">О нас</h1>
        <p class="hero__text">Учебный книжный магазин. Выберите книги и проверьте общую стоимость в корзине.</p>
        <a class="button button--accent" href="#catalog">Открыть каталог</a>
      </div>
      <div class="hero__books" aria-hidden="true">${covers}</div>
    </section>
    <section class="team">
      <h2 class="section-title">Команда</h2>
      <div class="team__grid">${members}</div>
    </section>`;
}
