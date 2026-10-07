export const Header = () => `
<header class="header" id="header">
  <div class="container">
    <a href="/" class="logo"><img src="/assets/logo-dark.png" alt="Pipe Deco Juegos - Inicio"></a>
    <button class="menu-btn" aria-label="Abrir menú" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="Principal">
      <a href="/#servicios">Servicios</a>
      <a href="/#trabajos">Trabajos</a>
      <a href="/#preguntas">Preguntas</a>
      <a href="/#contacto" class="btn">Cotizar</a>
    </nav>
  </div>
</header>`;

// Menú móvil (se usa en todas las páginas)
export function bindMenu() {
  document.addEventListener('click', (e) => {
    const header = document.querySelector('#header');
    const btn = e.target.closest('.menu-btn');
    if (btn) btn.setAttribute('aria-expanded', header.classList.toggle('open'));
    else if (e.target.closest('.nav a')) header.classList.remove('open');
  });
}
