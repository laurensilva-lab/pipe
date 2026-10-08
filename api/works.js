// API del panel. Requiere: Vercel Blob + ADMIN_PASSWORD (y opcional SESSION_SECRET).
import { put, list, del } from '@vercel/blob';
import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { CATEGORIES } from '../public/js/config.js';

const DB = 'data/works.json';
const TTL = 2 * 60 * 60;          // la sesión dura 2 horas
const MAX_IMG = 4 * 1024 * 1024;  // 4 MB por foto
const MAX_WORKS = 300, MAX_PHOTOS = 12;

/* ---------- Seguridad ---------- */
const sha = (s) => createHash('sha256').update(String(s)).digest();
const safeEqual = (a, b) => timingSafeEqual(sha(a), sha(b)); // comparación en tiempo constante
const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (v) => createHmac('sha256', secret()).update(v).digest('base64url');
const newToken = () => { const exp = String(Math.floor(Date.now() / 1000) + TTL); return `${exp}.${sign(exp)}`; };
const validToken = (t = '') => {
  const [exp, sig] = t.split('.');
  return Boolean(exp && sig && Number(exp) > Date.now() / 1000 && safeEqual(sig, sign(exp)));
};
const getCookie = (req, name) => (req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).find(([k]) => k === name)?.[1];
const setSession = (res, token, age) =>
  res.setHeader('Set-Cookie', `pipe_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${age}`);
const authed = (req) => Boolean(secret()) && validToken(getCookie(req, 'pipe_session'));
const sameOrigin = (req) => { try { return !req.headers.origin || new URL(req.headers.origin).host === req.headers.host; } catch { return false; } };

const attempts = new Map(); // límite de intentos de login por IP (por instancia)
function tooMany(ip) {
  const now = Date.now(), a = attempts.get(ip);
  if (!a || now - a.t > 15 * 60e3) { attempts.set(ip, { n: 1, t: now }); return false; }
  return ++a.n > 5;
}

/* ---------- Validación ---------- */
const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, n);
const okUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' && x.hostname.endsWith('.public.blob.vercel-storage.com'); } catch { return false; } };

/* ---------- Base de datos (JSON en Vercel Blob) ---------- */
async function read() {
  const { blobs } = await list({ prefix: DB });
  if (!blobs[0]) return [];
  const res = await fetch(`${blobs[0].url}?t=${Date.now()}`);
  return res.ok ? res.json() : [];
}
const write = (data) => put(DB, JSON.stringify(data), {
  access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60,
});

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const { action, id } = req.query;

    if (req.method === 'GET' && !action) {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
      return res.json(await read());
    }
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET' && !sameOrigin(req)) return res.status(403).json({ error: 'Origen no permitido' });

    if (req.method === 'POST' && action === 'login') {
      if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'Panel sin configurar' });
      const ip = req.headers['x-real-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x';
      if (tooMany(ip)) return res.status(429).json({ error: 'Demasiados intentos. Probá en 15 minutos.' });
      if (!safeEqual(req.body?.password ?? '', process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: 'Clave incorrecta' });
      attempts.delete(ip);
      setSession(res, newToken(), TTL);
      return res.json({ ok: true });
    }
    if (req.method === 'POST' && action === 'logout') { setSession(res, '', 0); return res.json({ ok: true }); }

    if (!authed(req)) return res.status(401).json({ error: 'No autorizado' });
    if (req.method === 'GET' && action === 'session') return res.json({ ok: true });

    // Subir, publicar y eliminar necesitan el almacenamiento (Blob) conectado al proyecto
    if ((req.method === 'POST' && action !== 'logout') || req.method === 'DELETE') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Falta crear el almacenamiento de fotos (Blob) en Vercel y volver a desplegar.' });
    }

    if (req.method === 'POST' && action === 'upload') {
      const buf = req.body;
      if (!Buffer.isBuffer(buf) || buf.length > MAX_IMG) return res.status(413).json({ error: 'Foto inválida o muy pesada' });
      if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return res.status(415).json({ error: 'Solo fotos JPG' });
      const { url } = await put(`works/${Date.now()}-${randomBytes(4).toString('hex')}.jpg`, buf, { access: 'public', contentType: 'image/jpeg' });
      return res.json({ url });
    }

    if (req.method === 'POST') {
      const { category, title, description, images, thumb } = req.body || {};
      const t = clean(title, 80);
      if (!CATEGORIES.some((c) => c.id === category) || !t || !Array.isArray(images) || !images.length
        || images.length > MAX_PHOTOS || !images.every(okUrl) || (thumb && !okUrl(thumb))) return res.status(400).json({ error: 'Datos inválidos' });
      const works = await read();
      if (works.length >= MAX_WORKS) return res.status(400).json({ error: 'Límite de trabajos alcanzado' });
      works.push({ id: `w${Date.now()}`, category, title: t, description: clean(description, 160), images, ...(thumb ? { thumb } : {}) });
      await write(works);
      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      if (!/^w\d+$/.test(id || '')) return res.status(400).json({ error: 'ID inválido' });
      const works = await read();
      const work = works.find((w) => w.id === id);
      if (!work) return res.status(404).json({ error: 'No existe' });
      await del([...work.images, ...(work.thumb ? [work.thumb] : [])]);
      await write(works.filter((w) => w.id !== id));
      return res.json({ ok: true });
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
