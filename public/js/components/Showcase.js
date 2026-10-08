import { esc, categoryLabel } from '../utils.js';

// Imagen grande (carrusel de fotos del trabajo) + tira de miniaturas para elegir otro trabajo.
const wide = matchMedia('(min-width: 900px)');          // en pantallas grandes la tira es vertical
const calm = matchMedia('(prefers-reduced-motion: reduce)');
let current = null;                                      // la galería activa (se reemplaza al filtrar)
addEventListener('resize', () => current?.recenter());

export function bindShowcase(root, list) {
  const box = root.querySelector('[data-showcase]');
  if (!box) { current = null; return; }

  const stage = box.querySelector('.stage');
  const $ = (s) => stage.querySelector(s);
  const slides = $('[data-slides]'), dots = box.querySelector('[data-dots]');
  const badge = $('[data-badge]'), prev = $('.slide-arrow.prev'), next = $('.slide-arrow.next'), expand = $('.expand');
  const strip = box.querySelector('[data-strip]');
  const thumbs = strip ? [...strip.querySelectorAll('.thumb')] : [];
  let index = -1, photo = 0, frame = 0, locked = false, unlock = 0, shots = 0;

  // ---------- fotos del trabajo (carrusel) ----------
  const setPhoto = (k) => {
    photo = k;
    [...dots.children].forEach((d, n) => d.classList.toggle('active', n === k));
    badge.textContent = `${k + 1}/${shots}`;
    prev.hidden = k === 0 || shots < 2;
    next.hidden = k === shots - 1 || shots < 2;
    expand.dataset.i = k;
  };
  const goPhoto = (k) => {
    k = Math.min(shots - 1, Math.max(0, k));
    slides.scrollTo({ left: k * slides.clientWidth, behavior: calm.matches ? 'auto' : 'smooth' });
  };
  let width = slides.clientWidth;
  slides.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      // si cambió el ancho (ej. se giró el celular) no se deduce la foto: se vuelve a la que estaba
      if (slides.clientWidth !== width) { width = slides.clientWidth; slides.scrollTo({ left: photo * width, behavior: 'auto' }); return; }
      const k = Math.round(slides.scrollLeft / (width || 1));
      if (k !== photo && k >= 0 && k < shots) setPhoto(k);
    });
  }, { passive: true });
  prev.addEventListener('click', () => goPhoto(photo - 1));
  next.addEventListener('click', () => goPhoto(photo + 1));
  slides.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault(); goPhoto(photo + step);
  });

  // ---------- trabajo elegido ----------
  const show = (i) => {
    if (i === index) return;
    index = i;
    const w = list[i];
    shots = w.images.length;
    slides.innerHTML = w.images.map((src, k) => `<img class="slide" src="${esc(src)}" alt="${esc(w.title)} (foto ${k + 1} de ${shots})" ${k ? 'loading="lazy" ' : ''}decoding="async" draggable="false">`).join('');
    slides.scrollTo({ left: 0, behavior: 'auto' });
    width = slides.clientWidth;
    const first = slides.firstElementChild;
    if (!first.complete) {
      slides.classList.add('changing');
      const done = () => slides.classList.remove('changing');
      first.addEventListener('load', done, { once: true }); first.addEventListener('error', done, { once: true });
    }
    dots.innerHTML = shots > 1 ? w.images.map(() => '<span class="dot"></span>').join('') : '';
    slides.setAttribute('aria-label', `Fotos de ${w.title}`);
    expand.dataset.work = w.id;
    $('[data-title]').textContent = w.title;
    $('[data-desc]').textContent = w.description || '';
    $('[data-cat]').textContent = categoryLabel(w.category);
    $('[data-count]').textContent = `${i + 1} / ${list.length}`;
    badge.hidden = shots < 2;
    setPhoto(0);
    thumbs.forEach((t, k) => {
      t.classList.toggle('active', k === i);
      if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  };

  // ---------- tira de miniaturas ----------
  if (strip) {
    // posición (en px) que deja la miniatura i centrada en la tira
    const target = (i) => {
      const t = thumbs[i];
      return wide.matches ? t.offsetTop + t.offsetHeight / 2 - strip.clientHeight / 2 : t.offsetLeft + t.offsetWidth / 2 - strip.clientWidth / 2;
    };
    const scrollStrip = (pos, smooth) => {
      const behavior = smooth && !calm.matches ? 'smooth' : 'auto';
      strip.scrollTo(wide.matches ? { top: pos, behavior } : { left: pos, behavior });
    };
    // elegir por toque/teclado: se selecciona al instante y la tira se acomoda sola
    const pick = (i, smooth = true) => {
      locked = true; clearTimeout(unlock); unlock = setTimeout(() => { locked = false; }, smooth ? 900 : 60);
      show(i); scrollStrip(target(i), smooth);
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
    let sf = 0;
    strip.addEventListener('scroll', () => {
      if (locked || sf) return;
      sf = requestAnimationFrame(() => { sf = 0; show(closest()); });
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
    current = { recenter: () => { scrollStrip(target(index), false); goPhoto(photo); } };
  } else {
    current = { recenter: () => goPhoto(photo) };
  }

  show(0);
}
