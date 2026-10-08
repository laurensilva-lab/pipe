import { esc } from '../utils.js';

export function openLightbox(work, start = 0) {
  let i = Math.min(Math.max(0, start), work.images.length - 1);
  const opener = document.activeElement;
  const el = document.createElement('div');
  el.className = 'lightbox';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', work.title);
  const many = work.images.length > 1;

  const draw = () => {
    el.innerHTML = `
      <button class="lb-close" data-a="close" aria-label="Cerrar">×</button>
      ${many ? '<button class="lb-nav prev" data-a="prev" aria-label="Anterior">‹</button><button class="lb-nav next" data-a="next" aria-label="Siguiente">›</button>' : ''}
      <figure>
        <img src="${esc(work.images[i])}" alt="${esc(work.title)} (foto ${i + 1})">
        <figcaption><strong>${esc(work.title)}</strong>${work.description ? ` · ${esc(work.description)}` : ''}${many ? ` <span>${i + 1}/${work.images.length}</span>` : ''}</figcaption>
      </figure>`;
  };
  const go = (d) => { i = (i + d + work.images.length) % work.images.length; draw(); };
  const close = () => { el.remove(); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; opener?.focus(); };
  const onKey = (e) => ({ Escape: close, ArrowLeft: () => go(-1), ArrowRight: () => go(1) })[e.key]?.();

  el.addEventListener('click', (e) => {
    const a = e.target.dataset.a;
    if (a === 'close' || e.target === el) close();
    else if (a === 'prev') go(-1);
    else if (a === 'next') go(1);
  });
  document.addEventListener('keydown', onKey);
  document.body.style.overflow = 'hidden';
  draw();
  document.body.append(el);
  el.querySelector('.lb-close').focus();
}
