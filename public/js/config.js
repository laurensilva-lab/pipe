// Datos de la marca y categorías. Para agregar una categoría nueva, sumá un objeto a CATEGORIES.
export const SITE = {
  name: 'Pipe Deco Juegos',
  whatsapp: '59892060185',
  phoneLabel: '+598 92 060 185',
  instagram: 'https://www.instagram.com/pipe.decojuegos/',
  credit: {
    name: 'Lala Serena',
    portfolio: 'https://nice-elements-205697.framer.app/',
    portfolioLabel: 'Lauren Silva',
  },
};

export const CATEGORIES = [
  { id: 'bodas',       label: 'Bodas',              icon: '💍', text: 'Ambientaciones elegantes para el día más importante.' },
  { id: 'cumpleanos',  label: 'Cumpleaños',         icon: '🎂', text: 'Temáticas personalizadas para chicos y grandes.' },
  { id: 'baby-shower', label: 'Baby Shower',        icon: '🍼', text: 'Dulces detalles para recibir a tu bebé.' },
  { id: 'juegos',      label: 'Alquiler de Juegos', icon: '🎪', text: 'Juegos y entretenimiento para tu evento.' },
];

// Fotos del collage principal
export const HERO_IMAGES = [
  '/assets/works/stitch-1.jpg',
  '/assets/works/masha-1.jpg',
  '/assets/works/babyshower-1.jpg',
];

// "Cómo trabajamos" (editable)
export const PROCESS = [
  { n: '1', title: 'Contanos tu idea', text: 'Escribinos por WhatsApp con la fecha, la temática y la cantidad de invitados.' },
  { n: '2', title: 'Presupuesto a medida', text: 'Te enviamos una propuesta pensada para tu evento.' },
  { n: '3', title: 'Armamos tu evento', text: 'Nos ocupamos de la decoración para que vos solo disfrutes.' },
];

// Preguntas frecuentes (editable)
export const FAQ = [
  { q: '¿Cómo pido un presupuesto?', a: 'Escribinos por WhatsApp contando la fecha, el tipo de evento y la cantidad de invitados. Te respondemos con una propuesta a medida.' },
  { q: '¿Hacen temáticas personalizadas?', a: 'Sí. Trabajamos la temática que elijas, con detalles personalizados como cajitas, souvenirs, centros de mesa y carteles con nombre.' },
  { q: '¿Con cuánta anticipación conviene reservar?', a: 'Cuanto antes mejor: la disponibilidad depende de la fecha. Consultanos y te confirmamos si tenemos lugar.' },
  { q: '¿Qué juegos tienen para alquilar?', a: 'Escribinos con la fecha y la cantidad de invitados y te contamos las opciones disponibles.' },
];
