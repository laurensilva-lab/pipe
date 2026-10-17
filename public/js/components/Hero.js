import { HERO_IMAGES } from '../config.js';
import { esc, waLink } from '../utils.js';

const ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

export const Hero = () => {
  const first = HERO_IMAGES[0];
  return `
<section class="hero hero-slider" id="inicio" aria-roledescription="carrusel" aria-label="Eventos destacados">
  <div class="hs-stage" data-stage>
    ${HERO_IMAGES.map((s, i) => `
    <div class="hslide${i ? '' : ' is-active'}" data-i="${i}"${i ? ' aria-hidden="true"' : ''}>
      <img ${i ? `data-src="${esc(s.src)}"` : `src="${esc(s.src)}" fetchpriority="high"`} alt="${esc(s.alt)}" decoding="async" draggable="false">
    </div>`).join('')}
  </div>
  <div class="hs-shade"></div>
  
  <!-- Flechas laterales de navegación -->
  <button class="hero-arrow prev" data-hero-prev aria-label="Imagen anterior">‹</button>
  <button class="hero-arrow next" data-hero-next aria-label="Imagen siguiente">›</button>

  <div class="container hs-content">
    <div class="hs-copy">
      <p class="eyebrow">Hacemos de cada evento un recuerdo</p>
      <h1>Decoración que da vida a tus momentos</h1>
      <p class="lead">Bodas, cumpleaños y baby showers con ambientaciones únicas, y alquiler de juegos para que todos disfruten.</p>
      <div class="hero-actions">
        <a class="btn" href="${waLink('Hola! Quiero cotizar la decoración de un evento')}" target="_blank" rel="noopener">Pedir presupuesto</a>
        <a class="btn ghost" href="#trabajos">Ver trabajos</a>
      </div>
    </div>
  </div>
  <a class="hs-card" href="#trabajos" data-goto="${esc(first.work)}" aria-label="Ver las fotos de ${esc(first.caption)} en la galería">
    <img src="${esc(first.thumb)}" alt="" width="48" height="60" data-card-img>
    <span><strong data-card-title>${esc(first.caption)}</strong><small>Ver fotos del evento</small></span>
    <b>${ARROW}</b>
  </a>
</section>`;
};

/* ---------- comportamiento: avance automático, pausa, deslizar, flechas y clic ---------- */
const calm = matchMedia('(prefers-reduced-motion: reduce)');

export function bindHero({ onOpen }) {
  const hero = document.querySelector('.hero-slider');
  if (!hero) return;
  const stage = hero.querySelector('[data-stage]');
  const slides = [...hero.querySelectorAll('.hslide')];
  const prevBtn = hero.querySelector('[data-hero-prev]');
  const nextBtn = hero.querySelector('[data-hero-next]');
  const card = hero.querySelector('.hs-card'), cardImg = hero.querySelector('[data-card-img]'), cardTitle = hero.querySelector('[data-card-title]');
  let i = 0, userPaused = false, hover = false, focus = false, hidden = document.hidden, inView = true, drag = false, moved = false;
  let autoTimer = null;

  const sync = () => hero.classList.toggle('paused', userPaused || hover || focus || hidden || !inView || drag);
  const load = (k) => { const img = slides[(k + slides.length) % slides.length].querySelector('img[data-src]'); if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); } };

  const go = (n) => {
    n = (n + slides.length) % slides.length;
    if (n === i) return;
    i = n;
    load(i); load(i + 1);
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
    const s = HERO_IMAGES[i];
    card.dataset.goto = s.work; card.setAttribute('aria-label', `Ver las fotos de ${s.caption} en la galería`);
    cardImg.src = s.thumb; cardTitle.textContent = s.caption;
  };

  // Temporizador automático limpio (cada 5 segundos avanza)
  const startAuto = () => {
    if (calm.matches || userPaused) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!hover && !focus && !hidden && !inView && !drag) {
        go(i + 1);
      }
    }, 5000);
  };

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(i - 1); startAuto(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(i + 1); startAuto(); });

  // Pausa por hover, foco, pestaña oculta o fuera de pantalla
  hero.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; sync(); } });
  hero.addEventListener('pointerleave', () => { hover = false; sync(); });
  hero.addEventListener('focusin', () => { focus = true; sync(); });
  hero.addEventListener('focusout', () => { focus = false; sync(); });
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; sync(); });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.2 }).observe(hero);

  // Deslizar con el dedo o arrastrar
  let sx = 0, sy = 0;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; drag = true; moved = false; sync(); });
  stage.addEventListener('pointermove', (e) => { if (drag && Math.abs(e.clientX - sx) > 10) moved = true; });
  stage.addEventListener('pointerup', (e) => {
    if (!drag) return;
    drag = false; sync();
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - sy)) { go(i + (dx < 0 ? 1 : -1)); moved = true; startAuto(); }
  });
  stage.addEventListener('pointercancel', () => { drag = false; sync(); });
  stage.addEventListener('click', () => { if (moved) { moved = false; return; } onOpen(HERO_IMAGES[i].work); });

  // Arrancar el ciclo automático
  startAuto();

  // Precarga de las otras fotos
  const first = slides[0].querySelector('img');
  const warm = () => setTimeout(() => { load(1); load(2); }, 400);
  if (first.complete) warm(); else first.addEventListener('load', warm, { once: true });
}