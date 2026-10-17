// Servidor local para editar el sitio: `npm run dev` y abrir http://localhost:3000
// - Sirve la carpeta public/ igual que Vercel (sin .html, 404 propio).
// - Recarga la página sola al guardar un archivo.
// - Aplica la misma política de seguridad (CSP) que producción, así se detecta antes de subir lo que Vercel bloquearía.
//   (Se omiten `upgrade-insecure-requests` y HSTS: rompen http://localhost en Safari.)
// - La API del panel (/api) no corre acá: el sitio muestra los trabajos fijos. Para probarla: `npm run dev:vercel`.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

// Cabeceras de seguridad de vercel.json (las de "/(.*)"), sin las que rompen localhost
const securityHeaders = {};
if (process.env.CSP !== '0') {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
    for (const h of cfg.headers || []) {
      if (h.source !== '/(.*)') continue;
      for (const { key, value } of h.headers) {
        if (key === 'Strict-Transport-Security') continue;
        securityHeaders[key] = key === 'Content-Security-Policy'
          ? value.split(';').map((d) => d.trim()).filter((d) => d && d !== 'upgrade-insecure-requests').join('; ')
          : value;
      }
    }
  } catch { /* sin vercel.json: se sirve sin cabeceras */ }
}

// ---- recarga automática ----
const clients = new Set();
let timer;
try {
  fs.watch(publicDir, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => { for (const res of clients) res.write('data: reload\n\n'); }, 120);
  });
} catch { console.log('(la recarga automática no está disponible en este sistema; actualizá la página a mano)'); }
const RELOAD_JS = "new EventSource('/__reload').onmessage=()=>location.reload();";

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { ...securityHeaders, 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function resolveFile(urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath); } catch { return null; }
  const abs = path.normalize(path.join(publicDir, rel));
  if (abs !== publicDir && !abs.startsWith(publicDir + path.sep)) return null;      // nada fuera de public/
  const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) return isFile(path.join(abs, 'index.html')) ? path.join(abs, 'index.html') : null;
  if (isFile(abs)) return abs;
  if (isFile(abs + '.html')) return abs + '.html';                                   // /admin -> admin.html
  return null;
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write('retry: 800\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  if (pathname === '/__livereload.js') return send(res, 200, RELOAD_JS, MIME['.js']);
  if (pathname.startsWith('/api/')) return send(res, 404, JSON.stringify({ error: 'La API no corre en modo local (usá "npm run dev:vercel")' }), MIME['.json']);

  const file = resolveFile(pathname);
  const status = file ? 200 : 404;
  const target = file || path.join(publicDir, '404.html');
  if (!fs.existsSync(target)) return send(res, 404, 'No encontrado');
  const ext = path.extname(target).toLowerCase();
  let body = fs.readFileSync(target);
  if (ext === '.html') body = Buffer.from(body.toString('utf8').replace('</body>', '<script src="/__livereload.js"></script></body>'));
  send(res, status, body, MIME[ext] || 'application/octet-stream');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`\nEl puerto ${PORT} ya está en uso. Cerrá la otra ventana de "npm run dev" o probá con otro puerto:\n  PORT=3001 npm run dev   (en Windows: set PORT=3001 && npm run dev)\n`);
  else console.error(e);
  process.exit(1);
});
server.listen(PORT, () => {
  console.log(`\n  Sitio listo en  http://localhost:${PORT}\n  (se recarga solo al guardar; para frenar: Ctrl + C)\n`);
});
