import { CATEGORIES } from '../config.js';
import { esc, waLink, categoryLabel } from '../utils.js';

export const visibleWorks = ({ works, filter }) => (filter === 'todos' ? works : works.filter((w) => w.category === filter));

export function Gallery(state) {
  const { filter } = state;
  const list = visibleWorks(state);
  const first = list[0];
  const pills = [{ id: 'todos', label: 'Todos' }, ...CATEGORIES]
    .map((c) => `<button class="pill ${c.id === filter ? 'active' : ''}" data-filter="${esc(c.id)}">${esc(c.label)}</button>`).join('');

  // Una sola imagen grande + una tira de miniaturas: la galería ocupa siempre el mismo alto, sin importar cuántos trabajos haya.
  const showcase = first ? `
    <div class="showcase" data-showcase>
      <button class="stage" type="button" data-work="${esc(first.id)}" aria-label="Ver fotos de ${esc(first.title)}">
        <img class="stage-img" src="${esc(first.images[0])}" alt="${esc(first.title)}" decoding="async">
        <span class="count" data-count>1 / ${list.length}</span>
        <span class="badge" data-badge ${first.images.length > 1 ? '' : 'hidden'}>${first.images.length} fotos</span>
        <span class="work-info"><small data-cat>${esc(categoryLabel(first.category))}</small><strong data-title>${esc(first.title)}</strong><span data-desc>${esc(first.description || '')}</span></span>
      </button>
      ${list.length > 1 ? `
      <div class="strip" data-strip role="group" aria-label="Elegí un trabajo">
        ${list.map((w, i) => `<button class="thumb${i ? '' : ' active'}" type="button" data-pick="${i}" aria-label="${esc(w.title)}"${i ? '' : ' aria-current="true"'}><img src="${esc(w.thumb || w.images[0])}" alt="" width="72" height="90" loading="lazy" decoding="async"></button>`).join('')}
      </div>` : ''}
    </div>` : '';

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
      ${showcase}
      ${first ? '' : empty}
    </div>
  </section>`;
}
