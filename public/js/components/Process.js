import { PROCESS } from '../config.js';
import { esc } from '../utils.js';

export const Process = () => `
<section class="section" id="proceso">
  <div class="container">
    <p class="eyebrow">Cómo trabajamos</p>
    <h2>Simple, cercano y sin vueltas</h2>
    <ol class="steps">
      ${PROCESS.map((s) => `<li><span class="step-n">${esc(s.n)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>`;
