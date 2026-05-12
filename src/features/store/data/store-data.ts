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
  compatibleBoards?: string[];
  wiringHint?: string;
}

const RAW_ITEMS = [
  {
    id: 'arduino-uno',
    title: 'Arduino Uno R3 (Official)',
    category: 'Arduino',
    price: 1999,
    rating: 4.9,
    reviewsCount: 1540,
    image: 'https://images.unsplash.com/photo-1548611716-10777fa1133f?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
    shortDescription: 'The industry standard for learning electronics and rapid prototyping.',
    fullDescription: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header and a reset button.',
    specs: { 'Voltage': '5V', 'Input Voltage': '7-12V', 'Digital I/O': '14', 'Analog Inputs': '6', 'Flash Memory': '32 KB', 'Clock Speed': '16 MHz' },
    stock: 'In Stock',
    compatibleBoards: ['Breadboard', 'Arduino Shields', 'ESP32 (via Logic Level)'],
    wiringHint: 'Connect the USB cable to your PC and the Uno. The ON LED should light up.'
  },
  {
    id: 'esp32-devkit',
    title: 'ESP32 DevKit V1 - Wi-Fi/BT',
    category: 'ESP32',
    price: 850,
    rating: 4.9,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    shortDescription: 'Powerful dual-core processor with integrated Wi-Fi and Bluetooth.',
    fullDescription: 'ESP32 is a single 2.4 GHz Wi-Fi-and-Bluetooth combo chip. It features a dual-core Xtensa® 32-bit LX6 microprocessor with up to 600 DMIPS.',
    specs: { 'Voltage': '3.3V', 'Cores': 'Dual Core', 'Wi-Fi': '802.11 b/g/n', 'Bluetooth': 'v4.2 BR/EDR', 'RAM': '520 KB', 'Speed': '240 MHz' },
    stock: 'High Demand',
    compatibleBoards: ['ESP32 Expansion Board', 'OLED Displays', 'LiPo Battery'],
    wiringHint: 'Use 3.3V logic level shifters if connecting to 5V sensors.'
  },
  {
    id: 'lidar-a1m8',
    title: 'RPLIDAR A1M8 - 360° Laser Scanner',
    category: 'Robotics',
    price: 12500,
    rating: 4.8,
    reviewsCount: 85,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80',
    badge: 'High Precision',
    shortDescription: 'Low-cost 360-degree 2D laser scanner for SLAM and robotics applications.',
    fullDescription: 'RPLIDAR A1 is a low cost 360 degree 2D laser scanner (LIDAR) solution developed by SLAMTEC. The system can perform 360 degree scan within 12-meter range.',
    specs: { 'Range': '0.15m - 12m', 'Angular Res': '1°', 'Sample Rate': '8000 Hz', 'Scan Freq': '5.5 Hz', 'Voltage': '5V', 'Interface': 'UART' },
    stock: 'In Stock',
    compatibleBoards: ['Arduino Mega', 'Raspberry Pi', 'Jetson Nano'],
    wiringHint: 'Requires a dedicated 5V 1A power supply for the motor and core.'
  }
];

const MOCK_REVIEWS_TEMPLATES: ProductReview[] = [
  { user: 'Dr. Engineering', rating: 5, date: 'Oct 12, 2025', text: 'Signal integrity is top-notch. Passed all our EMI testing cycles without issues. Highly recommended for industrial prototypes.' },
  { user: 'MakerPro_99', rating: 5, date: 'Nov 22, 2025', text: 'The documentation provided in the ProtoLab workspace was exactly what I needed to get this integrated in under 10 minutes.' },
  { user: 'RoboTech Labs', rating: 4, date: 'Dec 05, 2025', text: 'Great performance-to-price ratio. The mounting holes are standard, which made chassis integration very straightforward.' },
];

export const STORE_ITEMS: StoreItem[] = [];

// Seed
RAW_ITEMS.forEach(item => {
  STORE_ITEMS.push({
    ...item,
    gallery: [item.image, item.image, item.image],
    mockReviews: [...MOCK_REVIEWS_TEMPLATES]
  });
});

const CATEGORIES_CONFIG: Record<string, { prefix: string; count: number; priceRange: [number, number] }> = {
  'Arduino': { prefix: 'ARD', count: 40, priceRange: [500, 5000] },
  'ESP32': { prefix: 'ESP', count: 40, priceRange: [400, 2500] },
  'Sensors': { prefix: 'SNSR', count: 100, priceRange: [50, 3000] },
  'Modules': { prefix: 'MOD', count: 100, priceRange: [150, 4500] },
  'PCB Tools': { prefix: 'TOOL', count: 40, priceRange: [200, 8000] },
  'Motors': { prefix: 'MTR', count: 60, priceRange: [100, 6000] },
  'Displays': { prefix: 'DISP', count: 60, priceRange: [300, 12000] },
  'Power Supplies': { prefix: 'PWR', count: 60, priceRange: [100, 7000] },
  'Robotics': { prefix: 'ROB', count: 40, priceRange: [1000, 25000] },
  'IoT': { prefix: 'IOT', count: 40, priceRange: [500, 10000] }
};

const CATEGORY_NAMES = Object.keys(CATEGORIES_CONFIG);

const getPlaceholder = (cat: string, index: number) => {
  const colors = ['1e293b', '0f172a', '1e1b4b', '111827'];
  const color = colors[index % colors.length];
  return `https://placehold.co/800x600/${color}/cbd5e1?text=${encodeURIComponent(cat)}+${index}`;
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
      title: `Professional ${cat} ${config.prefix}-${1000 + i}`,
      category: cat,
      price,
      rating,
      reviewsCount: reviews,
      image: img,
      badge: i % 15 === 0 ? 'New' : i % 25 === 0 ? 'Featured' : '',
      shortDescription: `Advanced ${cat.toLowerCase()} component for precision engineering.`,
      fullDescription: `The ${cat} ${config.prefix}-${1000 + i} is a high-performance solution designed for professional environments. It offers reliable operation with verified specifications.`,
      specs: {
        'Type': cat,
        'Interface': i % 2 === 0 ? 'I2C' : 'SPI',
        'Voltage': i % 3 === 0 ? '3.3V' : '5V',
        'Origin': 'Global Partner'
      },
      stock: i % 12 === 0 ? 'Limited Stock' : 'In Stock',
      gallery: [img, img],
      mockReviews: [...MOCK_REVIEWS_TEMPLATES.slice(0, Math.floor(Math.random() * 3) + 1)],
      compatibleBoards: [cat === 'Arduino' ? 'Arduino Uno' : 'ESP32 DevKit'],
      wiringHint: 'Refer to the datasheet for specific pinout diagrams.'
    });
  }
});

export function getProductById(id: string) {
  return STORE_ITEMS.find(item => item.id === id);
}

export function getRelatedProducts(category: string, currentId: string, limit = 4) {
  return STORE_ITEMS
    .filter(item => item.category === category && item.id !== currentId)
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}
