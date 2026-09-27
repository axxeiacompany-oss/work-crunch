export interface MenuItem {
  id: string;
  name: string;
  category: 'arroz' | 'yakisoba' | 'pollo' | 'papas' | 'hamburguesas';
  categoryLabel: string;
  price: number;
  priceFormatted: string;
  description: string;
  image: string;
  variants?: { id: string; name: string; price: number; priceFormatted: string }[];
  sizes?: { id: string; name: string; price: number; priceFormatted: string }[];
  badge?: string;
}

export const RESTAURANT_INFO = {
  name: "Wok Crunch Oriental",
  slogan: "Sabor oriental en cada bocado",
  whatsappPhone: "0991607393",
  whatsappPhoneFormatted: "+595 991 607 393",
  whatsappUrl: "https://wa.me/595991607393",
  hours: "Abierto todos los días de 18:00 a 23:30 hs",
  deliveryNote: "Delivery a domicilio o retiro en el local",
};

export const MENU_CATEGORIES = [
  { id: 'todos', label: 'Todo el Menú', icon: '✨' },
  { id: 'arroz', label: 'Arroz Frito', icon: '🍚' },
  { id: 'yakisoba', label: 'Yakisoba', icon: '🍜' },
  { id: 'pollo', label: 'Pollo Frito', icon: '🍗' },
  { id: 'papas', label: 'Papas Fritas', icon: '🍟' },
  { id: 'hamburguesas', label: 'Hamburguesas', icon: '🍔' },
];

export const MENU_ITEMS: MenuItem[] = [
  // Arroz Frito
  {
    id: 'arroz-pollo',
    name: 'Arroz Frito de Pollo',
    category: 'arroz',
    categoryLabel: 'Arroz Frito 🍚',
    price: 23000,
    priceFormatted: '₲23.000',
    description: 'Arroz salteado al wok al fuego vivo con pechuga de pollo marinada, verduras frescas, huevo y toque especial de la casa.',
    image: '/images/arroz_pollo_dish_1790468115753.jpg',
    badge: 'Popular',
  },
  {
    id: 'arroz-carne',
    name: 'Arroz Frito con Carne',
    category: 'arroz',
    categoryLabel: 'Arroz Frito 🍚',
    price: 25000,
    priceFormatted: '₲25.000',
    description: 'Sabroso arroz salteado en wok con tiernos cortes de carne vacuna seleccionada, vegetales crujientes y cebollitas de verdeo.',
    image: '/images/arroz_carne_dish_1790468126449.jpg',
    badge: 'Favorito',
  },
  {
    id: 'arroz-camaron',
    name: 'Arroz Frito de Camarón',
    category: 'arroz',
    categoryLabel: 'Arroz Frito 🍚',
    price: 75000,
    priceFormatted: '₲75.000',
    description: 'Exquisito arroz al wok con generosos camarones salteados, toque sutil de jengibre, huevo y salsa oriental tradicional.',
    image: '/images/arroz_camaron_dish_1790468136099.jpg',
    badge: 'Premium',
  },

  // Yakisoba
  {
    id: 'yakisoba-pollo',
    name: 'Yakisoba de Pollo',
    category: 'yakisoba',
    categoryLabel: 'Yakisoba 🍜',
    price: 25000,
    priceFormatted: '₲25.000',
    description: 'Fideos tradicionales japoneses salteados al wok con tiernos bocados de pollo, repollo, zanahoria, cebolla y salsa yakisoba artesanal.',
    image: '/images/yakisoba_pollo_dish_1790468146314.jpg',
    badge: 'Clásico',
  },
  {
    id: 'yakisoba-carne',
    name: 'Yakisoba de Carne',
    category: 'yakisoba',
    categoryLabel: 'Yakisoba 🍜',
    price: 28000,
    priceFormatted: '₲28.000',
    description: 'Fideos orientales salteados a fuego alto con tiras de carne de res, vegetales frescos salteados y el irresistible toque oriental.',
    image: '/images/yakisoba_carne_dish_1790468155564.jpg',
    badge: 'Recomendado',
  },
  {
    id: 'yakisoba-camaron',
    name: 'Yakisoba de Camarón',
    category: 'yakisoba',
    categoryLabel: 'Yakisoba 🍜',
    price: 75000,
    priceFormatted: '₲75.000',
    description: 'Fideos yakisoba premium con camarones frescos cocinados a punto, verduras al wok y salsa teriyaki yakisoba casera.',
    image: '/images/yakisoba_camaron_dish_1790468165661.jpg',
    badge: 'Especial',
  },

  // Pollo Frito
  {
    id: 'pollo-agridulce',
    name: 'Pollo Frito Agridulce',
    category: 'pollo',
    categoryLabel: 'Pollo Frito 🍗',
    price: 40000,
    priceFormatted: '₲40.000',
    description: 'Pollo crocante glaseado con nuestra salsa agridulce oriental roja secreta y lluvia de semillas de sésamo tostadas.',
    image: '/images/pollo_agridulce_dish_1790468175792.jpg',
    badge: 'Más Pedido',
  },
  {
    id: 'pollo-picante',
    name: 'Pollo Frito Picante',
    category: 'pollo',
    categoryLabel: 'Pollo Frito 🍗',
    price: 40000,
    priceFormatted: '₲40.000',
    description: 'Pollo súper crujiente bañado en salsa picante oriental picante y adictiva para los amantes del buen sabor.',
    image: '/images/pollo_picante_dish_1790468185881.jpg',
    badge: 'Picante 🌶️',
  },
  {
    id: 'pollo-normal',
    name: 'Pollo Frito Normal (Clásico)',
    category: 'pollo',
    categoryLabel: 'Pollo Frito 🍗',
    price: 35000,
    priceFormatted: '₲35.000',
    description: 'Crocantes trozos de pollo dorado al estilo oriental tradicional, con su crujido característico y sabor jugoso por dentro.',
    image: '/images/pollo_normal_dish_1790468199417.jpg',
    badge: 'Crocante',
  },

  // Papas Fritas
  {
    id: 'papas-pequena',
    name: 'Papas Fritas (Pequeña)',
    category: 'papas',
    categoryLabel: 'Papas Fritas 🍟',
    price: 15000,
    priceFormatted: '₲15.000',
    description: 'Porción individual de papas fritas doradas, súper crujientes con el punto justo de sal.',
    image: '/images/papas_pequena_dish_1790468211070.jpg',
  },
  {
    id: 'papas-grande',
    name: 'Papas Fritas (Grande)',
    category: 'papas',
    categoryLabel: 'Papas Fritas 🍟',
    price: 20000,
    priceFormatted: '₲20.000',
    description: 'Generosa porción familiar o para compartir de papas fritas doraditas y crocantes.',
    image: '/images/papas_grande_dish_1790468221598.jpg',
    badge: 'Para Compartir',
  },

  // Hamburguesas
  {
    id: 'hamburguesa-pequena',
    name: 'Hamburguesa (Pequeña)',
    category: 'hamburguesas',
    categoryLabel: 'Hamburguesas 🍔',
    price: 15000,
    priceFormatted: '₲15.000',
    description: 'Hamburguesa clásica jugosa con queso derretido, vegetales frescos y salsas de la casa en pan suave tostado.',
    image: '/images/burger_pequena_dish_1790468232951.jpg',
  },
  {
    id: 'hamburguesa-grande',
    name: 'Hamburguesa (Grande)',
    category: 'hamburguesas',
    categoryLabel: 'Hamburguesas 🍔',
    price: 25000,
    priceFormatted: '₲25.000',
    description: 'Gran hamburguesa con carne extra jugosa, doble queso, lechuga crocante, tomate y salsa especial de Wok Crunch.',
    image: '/images/burger_grande_dish_1790468243010.jpg',
    badge: 'Contundente',
  },
];

export function formatGuarani(amount: number): string {
  return `₲${amount.toLocaleString('es-PY')}`;
}
