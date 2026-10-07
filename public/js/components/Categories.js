import { CATEGORIES } from '../config.js';
import { esc } from '../utils.js';

export const Categories = () => `
<section class="section cats" id="servicios">
  <div class="container">
    <p class="eyebrow">Qué hacemos</p>
    <h2>Un servicio para cada celebración</h2>
    <div class="cat-grid">
      ${CATEGORIES.map((c) => `
        <a class="cat-card" href="#trabajos" data-filter="${esc(c.id)}">
          <span class="ico"><img src="${esc(c.img)}" alt="" width="66" height="66" decoding="async"></span>
          <h3>${esc(c.label)}</h3>
          <p>${esc(c.text)}</p>
        </a>`).join('')}
    </div>
  </div>
</section>`;
