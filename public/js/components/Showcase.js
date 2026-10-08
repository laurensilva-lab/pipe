import { categoryLabel } from '../utils.js';

// Conecta la tira de miniaturas con la imagen grande: al deslizar la tira, el trabajo del centro pasa a ser el que se ve.
const wide = matchMedia('(min-width: 900px)');          // en pantallas grandes la tira es vertical
const calm = matchMedia('(prefers-reduced-motion: reduce)');
let current = null;                                      // la galería activa (se reemplaza al filtrar)
addEventListener('resize', () => current?.recenter());

export function bindShowcase(root, list) {
  const box = root.querySelector('[data-showcase]');
  const strip = box?.querySelector('[data-strip]');
  if (!box || !strip) { current = null; return; }

  const stage = box.querySelector('.stage');
  const img = stage.querySelector('.stage-img');
  const $ = (s) => stage.querySelector(s);
  const thumbs = [...strip.querySelectorAll('.thumb')];
  let index = 0, locked = false, frame = 0, unlock = 0;

  const show = (i) => {
    if (i === index) return;
    index = i;
    const w = list[i];
    const next = w.images[0];
    if (img.getAttribute('src') !== next) { img.classList.add('changing'); img.src = next; if (img.complete) img.classList.remove('changing'); }
    img.alt = w.title;
    stage.dataset.work = w.id;
    stage.setAttribute('aria-label', `Ver fotos de ${w.title}`);
    $('[data-title]').textContent = w.title;
    $('[data-desc]').textContent = w.description || '';
    $('[data-cat]').textContent = categoryLabel(w.category);
    $('[data-count]').textContent = `${i + 1} / ${list.length}`;
    const b = $('[data-badge]'); b.hidden = w.images.length < 2; b.textContent = `${w.images.length} fotos`;
    thumbs.forEach((t, k) => {
      t.classList.toggle('active', k === i);
      if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  };
  img.addEventListener('load', () => img.classList.remove('changing'));
  img.addEventListener('error', () => img.classList.remove('changing'));

  // posición (en px) que deja la miniatura i centrada en la tira
  const target = (i) => {
    const t = thumbs[i];
    return wide.matches ? t.offsetTop + t.offsetHeight / 2 - strip.clientHeight / 2 : t.offsetLeft + t.offsetWidth / 2 - strip.clientWidth / 2;
  };
  const scrollTo = (pos, smooth) => {
    const behavior = smooth && !calm.matches ? 'smooth' : 'auto';
    strip.scrollTo(wide.matches ? { top: pos, behavior } : { left: pos, behavior });
  };
  // elegir por toque/teclado: se selecciona al instante y la tira se acomoda sola
  const pick = (i, smooth = true) => {
    locked = true; clearTimeout(unlock); unlock = setTimeout(() => { locked = false; }, smooth ? 900 : 60);
    show(i); scrollTo(target(i), smooth);
  };
  // la miniatura más cercana al centro de la tira
  const closest = () => {
    const c = wide.matches ? strip.scrollTop + strip.clientHeight / 2 : strip.scrollLeft + strip.clientWidth / 2;
    let best = 0, dist = Infinity;
    thumbs.forEach((t, k) => {
      const m = wide.matches ? t.offsetTop + t.offsetHeight / 2 : t.offsetLeft + t.offsetWidth / 2;
      if (Math.abs(c - m) < dist) { dist = Math.abs(c - m); best = k; }
    });
    return best;
  };

  strip.addEventListener('scroll', () => {
    if (locked || frame) return;
    frame = requestAnimationFrame(() => { frame = 0; show(closest()); });
  }, { passive: true });
  strip.addEventListener('scrollend', () => { locked = false; });

  strip.addEventListener('click', (e) => {
    const t = e.target.closest('[data-pick]');
    if (t) pick(Number(t.dataset.pick));
  });
  strip.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = Math.min(thumbs.length - 1, Math.max(0, index + step));
    pick(i); thumbs[i].focus({ preventScroll: true });
  });

  current = { recenter: () => scrollTo(target(index), false) };
}
