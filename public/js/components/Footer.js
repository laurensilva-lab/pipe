import { SITE } from '../config.js';
import { waLink } from '../utils.js';

export const Footer = () => `
<footer class="footer">
  <div class="container footer-inner">
    <img src="/assets/logo-light.png" alt="${SITE.name}" class="footer-logo">
    <nav class="footer-links" aria-label="Pie de página">
      <a href="/#servicios">Servicios</a>
      <a href="/#trabajos">Trabajos</a>
      <a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="${waLink()}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <a href="/privacidad">Privacidad</a>
    </nav>
    <p class="copy">© ${new Date().getFullYear()} ${SITE.name}. Todos los derechos reservados.</p>
    <p class="copy">Creado por ${SITE.credit.name} · <a href="${SITE.credit.portfolio}" target="_blank" rel="noopener noreferrer">Portafolio ${SITE.credit.portfolioLabel}</a></p>
  </div>
</footer>
<a class="wa-float" href="${waLink('Hola! Quiero consultar por un evento')}" target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp">💬</a>`;
