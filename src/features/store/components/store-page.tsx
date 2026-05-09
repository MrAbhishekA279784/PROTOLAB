import { Search, Star, ShoppingCart, Download, ExternalLink } from "lucide-react";

const categories = ["All", "Microcontrollers", "Sensors", "Modules", "Kits", "Tools"];

const products = [
  { name: "Arduino Uno R3", category: "Microcontrollers", price: "$24.99", rating: 4.8, reviews: 2340, inStock: true, tag: "Popular", image: "https://images.unsplash.com/photo-1548611716-10777fa1133f?auto=format&fit=crop&w=300&q=80" },
  { name: "ESP32 DevKit", category: "Microcontrollers", price: "$12.99", rating: 4.7, reviews: 1890, inStock: true, tag: "Best Value", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80" },
  { name: "Raspberry Pi Pico", category: "Microcontrollers", price: "$4.99", rating: 4.6, reviews: 980, inStock: true, image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80" },
  { name: "DHT22 Temperature Sensor", category: "Sensors", price: "$6.49", rating: 4.5, reviews: 1560, inStock: true, image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80" },
  { name: "MPU6050 Accelerometer", category: "Sensors", price: "$3.99", rating: 4.4, reviews: 890, inStock: true, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80" },
  { name: "HC-SR04 Ultrasonic", category: "Sensors", price: "$2.99", rating: 4.3, reviews: 2100, inStock: false, image: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=300&q=80" },
  { name: "SG90 Servo Motor", category: "Modules", price: "$4.49", rating: 4.5, reviews: 3200, inStock: true, image: "https://images.unsplash.com/photo-1611116238612-4aaae7e82cd6?auto=format&fit=crop&w=300&q=80" },
  { name: "L298N Motor Driver", category: "Modules", price: "$5.99", rating: 4.4, reviews: 1450, inStock: true, image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=300&q=80" },
  { name: "Starter Kit Pro", category: "Kits", price: "$49.99", rating: 4.9, reviews: 890, inStock: true, tag: "Recommended", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80" },
];

const StorePage = () => (
  <div className="flex flex-col h-full bg-background">
    {/* Store Header */}
    <div className="border-b border-border bg-card px-6 py-4 shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <h2 className="text-lg font-semibold">Component Store</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Browse and add components directly to your projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="Search components..." className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
            <ShoppingCart className="w-3.5 h-3.5" />
            Cart (0)
          </button>
        </div>
      </div>
    </div>

    {/* Categories */}
    <div className="border-b border-border bg-card px-6 shrink-0">
      <div className="flex gap-0.5 max-w-6xl mx-auto">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              i === 0
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    {/* Products Grid */}
    <div className="flex-1 overflow-y-auto px-6 py-4 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.name} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 group">
            {/* Thumbnail placeholder */}
            <div className="w-full h-36 rounded-lg bg-secondary/30 flex items-center justify-center mb-4 overflow-hidden border border-border/50 relative">
               <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium">{p.name}</h4>
                <p className="text-[10px] text-muted-foreground">{p.category}</p>
              </div>
              {p.tag && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-accent/20 text-accent-foreground font-medium">
                  {p.tag}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-medium">{p.rating}</span>
              <span className="text-[10px] text-muted-foreground">({p.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-semibold">{p.price}</span>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Add to Sim
                </button>
                <button className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-primary text-primary-foreground flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StorePage;
