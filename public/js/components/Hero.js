import { HERO_IMAGES } from '../config.js';
import { waLink } from '../utils.js';

export const Hero = () => `
<section class="hero" id="inicio">
  <div class="container">
    <div>
      <p class="eyebrow">Hacemos de cada evento un recuerdo</p>
      <h1>Decoración que da vida a tus momentos</h1>
      <p class="lead">Bodas, cumpleaños y baby showers con ambientaciones únicas, y alquiler de juegos para que todos disfruten.</p>
      <div class="hero-actions">
        <a class="btn" href="${waLink('Hola! Quiero cotizar la decoración de un evento')}" target="_blank" rel="noopener">Pedir presupuesto</a>
        <a class="btn ghost" href="#trabajos">Ver trabajos</a>
      </div>
    </div>
    <div class="collage">
      <img class="a" src="${HERO_IMAGES[0]}" alt="Decoración de evento">
      <img class="b" src="${HERO_IMAGES[1]}" alt="Souvenirs personalizados">
      <img class="c" src="${HERO_IMAGES[2]}" alt="Mesa de dulces">
    </div>
  </div>
</section>`;
