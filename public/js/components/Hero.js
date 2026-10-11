import { HERO_IMAGES } from '../config.js';
import { esc, waLink } from '../utils.js';

const ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const PAUSE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

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
  <div class="container hs-content">
    <div class="hs-copy">
      <p class="eyebrow">Hacemos de cada evento un recuerdo</p>
      <h1>Decoración que da vida a tus momentos</h1>
      <p class="lead">Bodas, cumpleaños y baby showers con ambientaciones únicas, y alquiler de juegos para que todos disfruten.</p>
      <div class="hero-actions">
        <a class="btn" href="${waLink('Hola! Quiero cotizar la decoración de un evento')}" target="_blank" rel="noopener">Pedir presupuesto</a>
        <a class="btn ghost" href="#trabajos">Ver trabajos</a>
      </div>
      <div class="hs-controls">
        ${HERO_IMAGES.map((s, i) => `<button class="hbar${i ? '' : ' active'}" type="button" data-bar="${i}" aria-label="Ver ${esc(s.caption)}"${i ? '' : ' aria-current="true"'}><i></i></button>`).join('')}
        <button class="hpause" type="button" data-pause aria-label="Pausar carrusel">${PAUSE}</button>
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

/* ---------- comportamiento: avance automático, pausa, deslizar y clic ---------- */
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const PAUSE_ICON = PAUSE, PLAY_ICON = PLAY;

export function bindHero({ onOpen }) {
  const hero = document.querySelector('.hero-slider');
  if (!hero) return;
  const stage = hero.querySelector('[data-stage]');
  const slides = [...hero.querySelectorAll('.hslide')], bars = [...hero.querySelectorAll('.hbar')];
  const card = hero.querySelector('.hs-card'), cardImg = hero.querySelector('[data-card-img]'), cardTitle = hero.querySelector('[data-card-title]');
  const pauseBtn = hero.querySelector('[data-pause]');
  let i = 0, userPaused = false, hover = false, focus = false, hidden = document.hidden, inView = true, drag = false, moved = false;

  const sync = () => hero.classList.toggle('paused', userPaused || hover || focus || hidden || !inView || drag);
  const load = (k) => { const img = slides[(k + slides.length) % slides.length].querySelector('img[data-src]'); if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); } };

  const go = (n) => {
    n = (n + slides.length) % slides.length;
    if (n === i) return;
    i = n;
    load(i); load(i + 1);
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
    bars.forEach((b, k) => {
      b.classList.toggle('active', k === i); b.classList.toggle('done', k < i);
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    const s = HERO_IMAGES[i];
    card.dataset.goto = s.work; card.setAttribute('aria-label', `Ver las fotos de ${s.caption} en la galería`);
    cardImg.src = s.thumb; cardTitle.textContent = s.caption;
  };

  // la barra activa se llena en unos segundos; cuando termina, pasa a la siguiente foto
  hero.addEventListener('animationend', (e) => { if (e.target.matches('.hbar i')) go(i + 1); });
  bars.forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.bar))));

  // pausa: botón, mouse encima, foco del teclado, pestaña oculta o carrusel fuera de pantalla
  if (calm.matches) { userPaused = true; pauseBtn.hidden = true; }   // con "reducir movimiento" no avanza solo
  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused; sync();
    pauseBtn.innerHTML = userPaused ? PLAY_ICON : PAUSE_ICON;
    pauseBtn.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
  });
  hero.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; sync(); } });
  hero.addEventListener('pointerleave', () => { hover = false; sync(); });
  hero.addEventListener('focusin', (e) => { if (e.target !== pauseBtn) { focus = true; sync(); } });
  hero.addEventListener('focusout', () => { focus = false; sync(); });
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; sync(); });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.2 }).observe(hero);

  // deslizar con el dedo (o arrastrar) cambia de foto; tocar abre el trabajo en la galería
  let sx = 0, sy = 0;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; drag = true; moved = false; sync(); });
  stage.addEventListener('pointermove', (e) => { if (drag && Math.abs(e.clientX - sx) > 10) moved = true; });
  stage.addEventListener('pointerup', (e) => {
    if (!drag) return;
    drag = false; sync();
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - sy)) { go(i + (dx < 0 ? 1 : -1)); moved = true; }
  });
  stage.addEventListener('pointercancel', () => { drag = false; sync(); });
  stage.addEventListener('click', () => { if (moved) { moved = false; return; } onOpen(HERO_IMAGES[i].work); });

  // precarga tranquila de las otras fotos, sin competir con la primera
  const first = slides[0].querySelector('img');
  const warm = () => setTimeout(() => { load(1); load(2); }, 400);
  if (first.complete) warm(); else first.addEventListener('load', warm, { once: true });
}
