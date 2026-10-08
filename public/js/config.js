// Datos de la marca y categorías. Para agregar una categoría nueva, sumá un objeto a CATEGORIES.
export const SITE = {
  name: 'Pipe Deco Juegos',
  whatsapp: '59892060185',
  instagram: 'https://www.instagram.com/pipe.decojuegos/',
  credit: {
    name: 'Lala Serena',
    portfolio: 'https://nice-elements-205697.framer.app/',
  },
};

export const CATEGORIES = [
  { id: 'bodas',       label: 'Bodas',              img: '/assets/icons/bodas.webp', text: 'Ambientaciones elegantes para el día más importante.' },
  { id: 'cumpleanos',  label: 'Cumpleaños',         img: '/assets/icons/cumpleanos.webp', text: 'Temáticas personalizadas para chicos y grandes.' },
  { id: 'baby-shower', label: 'Baby Shower',        img: '/assets/icons/baby-shower.webp', text: 'Dulces detalles para recibir a tu bebé.' },
  { id: 'juegos',      label: 'Alquiler de Juegos', img: '/assets/icons/juegos.webp', text: 'Juegos y entretenimiento para tu evento.' },
];

// Fotos colgadas del inicio (la primera queda al centro)
export const HERO_IMAGES = [
  { src: '/assets/hero/stitch.jpg', alt: 'Arco de globos y mesa de dulces de Lilo & Stitch', caption: 'Lilo & Stitch' },
  { src: '/assets/hero/masha.jpg', alt: 'Cumpleaños de Masha y el Oso con troncos y hongos', caption: 'Masha' },
  { src: '/assets/hero/babyshower.jpg', alt: 'Revelación de género con conejitos y arco de globos', caption: 'Baby shower' },
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
