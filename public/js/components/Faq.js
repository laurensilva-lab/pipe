import { FAQ } from '../config.js';
import { esc } from '../utils.js';

export const Faq = () => `
<section class="section faq" id="preguntas">
  <div class="container">
    <p class="eyebrow">Preguntas frecuentes</p>
    <h2>Resolvemos tus dudas</h2>
    <div class="faq-list">
      ${FAQ.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
    </div>
  </div>
</section>`;
