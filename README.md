# Pipe Deco Juegos – sitio web

JavaScript puro (módulos ES) + API en Vercel para el panel `/admin`.

## Estructura
- `public/` → el sitio (index, 404, privacidad, admin, css, js, assets, robots, sitemap, manifest).
- `public/js/config.js` → teléfono, Instagram, crédito, **categorías**, "cómo trabajamos" y **preguntas frecuentes**.
- `public/js/data/works.js` → trabajos fijos.
- `public/js/components/` → un archivo por sección.
- `api/works.js` → API del panel. `vercel.json` → cabeceras de seguridad.

## Publicar en Vercel
1. Subí la carpeta a GitHub e importala en Vercel (el `vercel.json` ya indica `public` como carpeta de salida).
2. **Storage → Create → Blob** (conecta `BLOB_READ_WRITE_TOKEN` solo).
3. **Settings → Environment Variables**: `ADMIN_PASSWORD` (clave larga, 14+ caracteres) y opcional `SESSION_SECRET` (texto aleatorio largo).
4. Redeploy y entrá a `/admin`.

## Antes de salir al aire
Reemplazá `TU-DOMINIO.com` por tu dominio real en: `public/index.html`, `public/privacidad.html`, `public/robots.txt` y `public/sitemap.xml`.

## Seguridad incluida
- CSP estricta, HSTS, anti-clickjacking, nosniff, Referrer/Permissions-Policy (`vercel.json`).
- Sesión con cookie HttpOnly + Secure + SameSite=Strict (la clave no se guarda en el navegador), vence a las 2 horas.
- Comparación de clave en tiempo constante, límite de 5 intentos por 15 min, chequeo de origen.
- Subidas validadas (solo JPG real, máx. 4 MB, 12 fotos), categorías y URLs validadas, textos saneados.
- Recomendado: activar 2FA en GitHub y Vercel, y una regla de Rate Limit en Vercel Firewall para `/api/*`.

Probar en tu PC: `npm i -g vercel && npm i && vercel dev`.
