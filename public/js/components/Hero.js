import { HERO_IMAGES } from '../config.js';
import { esc, waLink } from '../utils.js';

const POSITIONS = ['center', 'left', 'right'];   // la primera foto va al centro

export const Hero = () => `
<section class="hero" id="inicio">
  <div class="container hero-grid">
    <div class="hero-title">
      <p class="eyebrow">Hacemos de cada evento un recuerdo</p>
      <h1>Decoración que da vida a tus momentos</h1>
    </div>
    <div class="prints" role="group" aria-label="Algunos de nuestros eventos">
      <svg class="twine" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10Q50 34 100 10" fill="none" stroke="currentColor" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>
      ${HERO_IMAGES.map((p, i) => `
      <figure class="print ${POSITIONS[i]}">
        <img src="${esc(p.src)}" alt="${esc(p.alt)}" width="720" height="900" decoding="async"${i === 0 ? ' fetchpriority="high"' : ''}>
        <figcaption>${esc(p.caption)}</figcaption>
      </figure>`).join('')}
    </div>
    <div class="hero-copy">
      <p class="lead">Bodas, cumpleaños y baby showers con ambientaciones únicas, y alquiler de juegos para que todos disfruten.</p>
      <div class="hero-actions">
        <a class="btn" href="${waLink('Hola! Quiero cotizar la decoración de un evento')}" target="_blank" rel="noopener">Pedir presupuesto</a>
        <a class="btn ghost" href="#trabajos">Ver trabajos</a>
      </div>
    </div>
  </div>
</section>`;
