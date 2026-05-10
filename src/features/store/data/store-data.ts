// --- Data for the Hardware Marketplace ---

export interface ProductReview {
  user: string;
  rating: number;
  date: string;
  text: string;
}

export interface StoreItem {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  specs: Record<string, string>;
  stock: string;
  gallery: string[];
  mockReviews: ProductReview[];
}

const RAW_ITEMS = [
  {
    id: 'arduino-uno',
    title: 'Arduino Uno R3',
    category: 'Microcontrollers',
    price: 24.99,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1548611716-10777fa1133f?auto=format&fit=crop&w=300&q=80',
    badge: 'Popular',
    shortDescription: 'The industry standard for learning electronics and rapid prototyping.',
    fullDescription: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P.',
    specs: { 'Voltage': '5V', 'Input Voltage': '7-12V', 'Digital I/O': '14', 'Analog Inputs': '6', 'Flash Memory': '32 KB', 'Clock Speed': '16 MHz' },
    stock: 'In Stock'
  },
  {
    id: 'esp32-devkit',
    title: 'ESP32 DevKit V1',
    category: 'Microcontrollers',
    price: 9.99,
    rating: 4.9,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
    badge: 'Best Seller',
    shortDescription: 'Powerful dual-core processor with integrated Wi-Fi and Bluetooth.',
    fullDescription: 'ESP32 is a single 2.4 GHz Wi-Fi-and-Bluetooth combo chip.',
    specs: { 'Voltage': '3.3V', 'Cores': 'Dual Core', 'Wi-Fi': '802.11 b/g/n', 'Bluetooth': 'v4.2 BR/EDR', 'RAM': '520 KB', 'Speed': '240 MHz' },
    stock: 'High Demand'
  },
  {
    id: 'sensors-kit',
    title: 'Precision Sensor Kit',
    category: 'Kits',
    price: 35.00,
    rating: 4.7,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
    badge: 'Value Pack',
    shortDescription: 'Comprehensive set of 36 high-quality sensors for various applications.',
    fullDescription: 'This sensor kit is perfect for beginners and experts alike.',
    specs: { 'Total Items': '36', 'Storage': 'Hard Shell Case', 'Manual': 'Included (Digital)', 'Compatibility': 'Arduino, ESP32, Pi' },
    stock: 'In Stock'
  }
];

const MOCK_REVIEWS_TEMPLATES: ProductReview[] = [
  { user: 'Alex G.', rating: 5, date: 'Oct 12, 2025', text: 'Excellent quality, worked perfectly for my smart home project.' },
  { user: 'Sarah M.', rating: 4, date: 'Nov 02, 2025', text: 'Good documentation, though the headers needed some soldering.' },
  { user: 'ElectronicsGuru', rating: 5, date: 'Dec 15, 2025', text: 'The best value I have found online. Fast shipping too.' },
  { user: 'StudentE', rating: 3, date: 'Jan 05, 2026', text: 'A bit expensive compared to other sites, but the quality is high.' },
];

export const STORE_ITEMS: StoreItem[] = [];

// Seed the items from RAW
RAW_ITEMS.forEach(item => {
  STORE_ITEMS.push({
    ...item,
    price: item.price * 80,
    gallery: [item.image, item.image, item.image],
    mockReviews: [...MOCK_REVIEWS_TEMPLATES]
  });
});

// Generate items to fill catalog
const CATEGORIES_CONFIG: Record<string, { prefix: string; count: number; priceRange: [number, number] }> = {
  'Microcontrollers': { prefix: 'MCU', count: 100, priceRange: [150, 2500] },
  'Sensors': { prefix: 'SNSR', count: 150, priceRange: [50, 1500] },
  'Modules': { prefix: 'MOD', count: 150, priceRange: [200, 3500] },
  'Passive Components': { prefix: 'COMP', count: 150, priceRange: [2, 100] },
  'Transistors & ICs': { prefix: 'SEMI', count: 100, priceRange: [10, 500] },
  'Motors & Actuators': { prefix: 'MTR', count: 100, priceRange: [150, 5000] },
  'Power Supplies': { prefix: 'PWR', count: 100, priceRange: [100, 4500] },
  'Development Boards': { prefix: 'BRD', count: 100, priceRange: [300, 8000] },
  'Kits': { prefix: 'KIT', count: 50, priceRange: [500, 12000] }
};

const CATEGORY_NAMES = Object.keys(CATEGORIES_CONFIG);

const getPlaceholder = (cat: string, index: number) => {
  const colors = ['1e293b', '0f172a', '1e1b4b', '111827'];
  const textColor = 'cbd5e1';
  const color = colors[index % colors.length];
  return `https://placehold.co/600x400/${color}/${textColor}?text=${encodeURIComponent(cat)}+${index}`;
};

CATEGORY_NAMES.forEach(cat => {
  const config = CATEGORIES_CONFIG[cat];
  for (let i = 0; i < config.count; i++) {
    const id = `${config.prefix.toLowerCase()}-${1000 + i}`;
    if (STORE_ITEMS.find(it => it.id === id)) continue;

    const price = Math.floor(Math.random() * (config.priceRange[1] - config.priceRange[0]) + config.priceRange[0]);
    const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
    const reviews = Math.floor(Math.random() * 450) + 10;
    const img = getPlaceholder(cat, i);

    STORE_ITEMS.push({
      id,
      title: `${cat} ${config.prefix}-${1000 + i}`,
      category: cat,
      price,
      rating,
      reviewsCount: reviews,
      image: img,
      badge: i % 20 === 0 ? 'New' : i % 25 === 0 ? 'Best Seller' : '',
      shortDescription: `Professional grade ${cat.toLowerCase()} for high-precision engineering projects.`,
      fullDescription: `This ${cat.toLowerCase()} component is part of our professional engineering series.`,
      specs: {
        'Type': cat,
        'Model': `${config.prefix}-${1000 + i}`,
        'Voltage': i % 2 === 0 ? '5V' : '3.3V',
        'Interface': i % 3 === 0 ? 'I2C' : 'Digital',
        'Origin': 'Verified Global Partner'
      },
      stock: i % 15 === 0 ? 'Out of Stock' : i % 12 === 0 ? 'Limited' : 'In Stock',
      gallery: [img, img],
      mockReviews: [...MOCK_REVIEWS_TEMPLATES.slice(0, Math.floor(Math.random() * 3) + 1)]
    });
  }
});

// Fill to 1000 items if needed
const currentCount = STORE_ITEMS.length;
if (currentCount < 1000) {
  for (let i = 0; i < (1000 - currentCount); i++) {
    const cat = CATEGORY_NAMES[i % CATEGORY_NAMES.length];
    const config = CATEGORIES_CONFIG[cat];
    const id = `extra-${i}`;
    const price = Math.floor(Math.random() * (config.priceRange[1] - config.priceRange[0]) + config.priceRange[0]);
    const img = getPlaceholder(cat, i + 1000);

    STORE_ITEMS.push({
      id,
      title: `Industrial ${cat} Unit ${i + 5000}`,
      category: cat,
      price,
      rating: 4.5,
      reviewsCount: 88,
      image: img,
      badge: '',
      shortDescription: 'High-reliability industrial component for mission-critical systems.',
      fullDescription: 'Designed for 24/7 operation in harsh environments.',
      specs: { 'Standard': 'IEC 61010', 'Life': '100,000 hrs' },
      stock: 'In Stock',
      gallery: [img],
      mockReviews: [MOCK_REVIEWS_TEMPLATES[0]]
    });
  }
}

export function getProductById(id: string) {
  return STORE_ITEMS.find(item => item.id === id);
}

export function getRelatedProducts(category: string, currentId: string, limit = 4) {
  return STORE_ITEMS
    .filter(item => item.category === category && item.id !== currentId)
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}
