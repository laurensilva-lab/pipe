import { STATIC_WORKS } from './data/works.js';

// Trabajos fijos + los subidos desde el panel (los más nuevos primero).
export async function loadWorks() {
  try {
    const res = await fetch('/api/works');
    if (!res.ok) throw new Error();
    const uploaded = await res.json();
    return [...uploaded.reverse(), ...STATIC_WORKS];
  } catch {
    return STATIC_WORKS; // sin API (ej. abriendo el HTML local)
  }
}
