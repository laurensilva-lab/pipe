import { loadWorks } from './api.js';
import { Header, bindMenu } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { Categories } from './components/Categories.js';
import { Gallery } from './components/Gallery.js';
import { Process } from './components/Process.js';
import { Faq } from './components/Faq.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';
import { openLightbox } from './components/Lightbox.js';

const state = { works: [], filter: 'todos' };
const $ = (s) => document.querySelector(s);
const renderGallery = () => { $('#gallery-root').innerHTML = Gallery(state); };

$('#app').innerHTML = `${Header()}<main id="contenido">${Hero()}${Categories()}<div id="gallery-root"></div>${Process()}${Faq()}${Contact()}</main>${Footer()}`;
renderGallery();
bindMenu();

document.addEventListener('click', (e) => {
  const filter = e.target.closest('[data-filter]');
  if (filter) { state.filter = filter.dataset.filter; renderGallery(); return; }
  const work = e.target.closest('[data-work]');
  if (work) openLightbox(state.works.find((w) => w.id === work.dataset.work));
});

state.works = await loadWorks();
renderGallery();
