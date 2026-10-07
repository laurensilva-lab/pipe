import { CATEGORIES } from './config.js';
import { esc, categoryLabel } from './utils.js';

const root = document.querySelector('#admin');
const $ = (s) => document.querySelector(s);

async function api(query = '', opts = {}) {
  const res = await fetch('/api/works' + query, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Error'), { status: res.status });
  return data;
}
const json = (body) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const onError = (err) => (err.status === 401 ? loginView('Tu sesión expiró. Volvé a ingresar.') : null);

// Achica la foto antes de subirla (más rápido y liviano)
async function shrink(file, max = 1600) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((ok) => canvas.toBlob(ok, 'image/jpeg', 0.82));
}

function loginView(msg = '') {
  root.innerHTML = `
    <form class="card" id="login">
      <h1>Panel de administración</h1>
      <input type="password" name="password" placeholder="Clave" autocomplete="current-password" required autofocus>
      <button class="btn">Entrar</button>
      <p class="error" role="alert">${esc(msg)}</p>
    </form>`;
  $('#login').onsubmit = async (e) => {
    e.preventDefault();
    try { await api('?action=login', json({ password: new FormData(e.target).get('password') })); panelView(); }
    catch (err) { loginView(err.message); }
  };
}

function panelView() {
  root.innerHTML = `
    <div class="admin-head"><h1>Subir trabajo</h1><button class="btn ghost" id="out">Salir</button></div>
    <form class="card" id="up">
      <label>Categoría<select name="category">${CATEGORIES.map((c) => `<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('')}</select></label>
      <label>Título<input name="title" required maxlength="80" placeholder="Ej: Cumple de Lilo & Stitch"></label>
      <label>Descripción (opcional)<input name="description" maxlength="160"></label>
      <label>Fotos (hasta 12)<input type="file" name="files" accept="image/*" multiple required></label>
      <button class="btn">Publicar</button>
      <p id="status" class="muted" role="status"></p>
    </form>
    <h2>Trabajos subidos</h2>
    <div id="list" class="admin-list"></div>`;

  $('#out').onclick = async () => { await api('?action=logout', { method: 'POST' }).catch(() => {}); loginView(); };

  $('#up').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target, data = new FormData(form), status = $('#status');
    try {
      const files = [...form.elements.files.files].slice(0, 12), images = [];
      for (const [n, file] of files.entries()) {
        status.textContent = `Subiendo foto ${n + 1} de ${files.length}…`;
        const { url } = await api('?action=upload', { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: await shrink(file) });
        images.push(url);
      }
      await api('', json({ category: data.get('category'), title: data.get('title'), description: data.get('description'), images }));
      form.reset(); status.textContent = '¡Publicado! ✅'; renderList();
    } catch (err) { onError(err) ?? (status.textContent = 'Error: ' + err.message); }
  };
  renderList();
}

async function renderList() {
  const list = $('#list');
  const works = (await fetch('/api/works').then((r) => r.json()).catch(() => [])).reverse();
  list.innerHTML = works.length ? works.map((w) => `
    <div class="admin-item">
      <img src="${esc(w.images[0])}" alt="">
      <div><strong>${esc(w.title)}</strong><small>${esc(categoryLabel(w.category))} · ${w.images.length} foto(s)</small></div>
      <button class="btn ghost" data-del="${esc(w.id)}">Eliminar</button>
    </div>`).join('') : '<p class="muted">Todavía no subiste trabajos desde el panel.</p>';
  list.onclick = async (e) => {
    const id = e.target.dataset.del;
    if (!id || !confirm('¿Eliminar este trabajo?')) return;
    try { await api('?id=' + encodeURIComponent(id), { method: 'DELETE' }); renderList(); } catch (err) { onError(err); }
  };
}

api('?action=session').then(panelView).catch(() => loginView());
