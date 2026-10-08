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
      <div class="stage-wrap">
        <div class="stage">
          <div class="slides" data-slides tabindex="0" role="group" aria-roledescription="carrusel" aria-label="Fotos de ${esc(first.title)}"></div>
          <span class="count" data-count>1 / ${list.length}</span>
          <span class="badge" data-badge hidden></span>
          <button class="slide-arrow prev" type="button" data-nav="-1" aria-label="Foto anterior" hidden>‹</button>
          <button class="slide-arrow next" type="button" data-nav="1" aria-label="Foto siguiente" hidden>›</button>
          <button class="expand" type="button" data-work="${esc(first.id)}" data-i="0" aria-label="Ver foto en pantalla completa"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
          <span class="work-info"><small data-cat>${esc(categoryLabel(first.category))}</small><strong data-title>${esc(first.title)}</strong><span data-desc>${esc(first.description || '')}</span></span>
        </div>
        <div class="dots" data-dots aria-hidden="true"></div>
      </div>
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
