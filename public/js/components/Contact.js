import { SITE } from '../config.js';
import { waLink } from '../utils.js';

export const Contact = () => `
<section class="section contact" id="contacto">
  <div class="container">
    <p class="eyebrow">Contacto</p>
    <h2>Contanos tu idea y la hacemos realidad</h2>
    <p class="lead">Escribinos y te armamos un presupuesto a medida.</p>
    <div class="hero-actions">
      <a class="btn light" href="${waLink('Hola! Quiero cotizar un evento')}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn ghost-light" href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a>
    </div>
  </div>
</section>`;
