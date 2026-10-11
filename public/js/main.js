import { loadWorks } from './api.js';
import { Header, bindMenu } from './components/Header.js';
import { Hero, bindHero } from './components/Hero.js';
import { Categories } from './components/Categories.js';
import { Gallery, visibleWorks } from './components/Gallery.js';
import { bindShowcase, selectWork } from './components/Showcase.js';
import { Process } from './components/Process.js';
import { Faq } from './components/Faq.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';
import { openLightbox } from './components/Lightbox.js';

const state = { works: [], filter: 'todos' };
const $ = (s) => document.querySelector(s);
const renderGallery = () => { const root = $('#gallery-root'); root.innerHTML = Gallery(state); bindShowcase(root, visibleWorks(state)); };

$('#app').innerHTML = `${Header()}<main id="contenido">${Hero()}${Categories()}<div id="gallery-root"></div>${Process()}${Faq()}${Contact()}</main>${Footer()}`;
renderGallery();
bindMenu();

// Lleva a la galería y deja elegido el trabajo pedido (desde el carrusel del inicio)
let wanted = null;
function goToWork(id) {
  wanted = id;
  if (state.filter !== 'todos') { state.filter = 'todos'; renderGallery(); }
  selectWork(id);
  $('#trabajos').scrollIntoView({ block: 'start' });
}
bindHero({ onOpen: goToWork });

document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-goto]');
  if (go) { e.preventDefault(); goToWork(go.dataset.goto); return; }
  const filter = e.target.closest('[data-filter]');
  if (filter) { state.filter = filter.dataset.filter; renderGallery(); return; }
  const work = e.target.closest('[data-work]');
  if (work) openLightbox(state.works.find((w) => w.id === work.dataset.work), Number(work.dataset.i) || 0);
});

state.works = await loadWorks();
renderGallery();
if (wanted) selectWork(wanted);   // por si tocaron una foto antes de que terminaran de cargar los trabajos
