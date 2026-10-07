import { CATEGORIES } from '../config.js';
import { esc, waLink, categoryLabel } from '../utils.js';

export function Gallery({ works, filter }) {
  const list = filter === 'todos' ? works : works.filter((w) => w.category === filter);
  const pills = [{ id: 'todos', label: 'Todos' }, ...CATEGORIES]
    .map((c) => `<button class="pill ${c.id === filter ? 'active' : ''}" data-filter="${esc(c.id)}">${esc(c.label)}</button>`).join('');
  const cards = list.map((w) => `
    <button class="work" data-work="${esc(w.id)}" aria-label="Ver ${esc(w.title)}">
      <img src="${esc(w.images[0])}" alt="${esc(w.title)}" loading="lazy">
      ${w.images.length > 1 ? `<span class="badge">${w.images.length} fotos</span>` : ''}
      <span class="work-info"><small>${esc(categoryLabel(w.category))}</small><strong>${esc(w.title)}</strong></span>
    </button>`).join('');
  const empty = `
    <div class="empty">
      <p>Estamos preparando esta galería ✨</p>
      <a class="btn" href="${waLink('Hola! Quiero consultar por ' + (filter === 'todos' ? 'decoración' : categoryLabel(filter)))}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
    </div>`;

  return `
  <section class="section" id="trabajos">
    <div class="container">
      <p class="eyebrow">Nuestros trabajos</p>
      <h2>Galería de eventos</h2>
      <div class="pills">${pills}</div>
      <div class="grid">${cards}</div>
      ${list.length ? '' : empty}
    </div>
  </section>`;
}
