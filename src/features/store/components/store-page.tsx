// REPLACED — original store was at src/features/store/components/store-page.tsx (simple 9-product static page)

import React, { useState, useEffect, useMemo } from 'react';
import { SafeIcon } from '@/components/ui/safe-icon';
import {
  ShoppingCart,
  Search,
  Star,
  Plus,
  Check,
  Eye,
  Filter,
  ArrowUpDown,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORE_ITEMS, StoreItem } from '@/features/store/data/store-data';

// --- Sub-components ---

function ProductCard({ item, setPreviewItem, handleAddToCart, isAddingToCart, onAddToSim }: { item: StoreItem; setPreviewItem: (item: StoreItem) => void; handleAddToCart: (id: string) => void; isAddingToCart: string | null; onAddToSim?: (id: string) => void }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-muted flex items-center justify-center p-4 cursor-pointer" onClick={() => setPreviewItem(item)}>
        <motion.img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="max-w-[80%] max-h-[85%] object-contain drop-shadow-md"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        />
        {item.badge && (
          <div className="absolute top-3 left-3">
            <Badge>{item.badge}</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 bg-background/80 backdrop-blur-[2px]">
           <button
             onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
             className="h-8 w-8 flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg backdrop-blur-md transition-all"
           >
             <SafeIcon icon={Eye} size={15} />
           </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-border">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.category}</span>
          <div className="flex items-center gap-1">
            <SafeIcon icon={Star} size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-bold text-foreground">{item.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-[14px] font-bold text-foreground mb-1.5 leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>

        <div className="mt-auto flex items-end justify-between">
          <span className="text-lg font-black text-foreground tracking-tight">₹{item.price.toFixed(0)}</span>
          <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded italic">{item.stock}</span>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
          <button
            onClick={() => onAddToSim?.(item.id)}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 text-[11px] font-bold text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground rounded-lg transition-all active:scale-95"
          >
            <SafeIcon icon={Plus} size={13} /> Sim
          </button>
          <button
            disabled={isAddingToCart === item.id}
            onClick={() => handleAddToCart(item.id)}
            className={`flex-1 h-9 flex items-center justify-center gap-1.5 text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95
              ${isAddingToCart === item.id ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}
          >
            {isAddingToCart === item.id ? <SafeIcon icon={Check} size={14} /> : <SafeIcon icon={ShoppingCart} size={14} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Badge({ children }: { children: string }) {
  return <div className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">{children}</div>;
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-[340px] animate-pulse">
      <div className="h-44 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-6 w-1/2 bg-muted rounded" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 bg-muted rounded" />
          <div className="h-9 flex-1 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

const CATEGORIES = [
  'All Components',
  'Microcontrollers',
  'Sensors',
  'Modules',
  'Passive Components',
  'Transistors & ICs',
  'Motors & Actuators',
  'Power Supplies',
  'Development Boards',
  'Kits'
];

const StorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Components');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Popularity');
  const [previewItem, setPreviewItem] = useState<(typeof STORE_ITEMS)[number] | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sortedAndFilteredItems = useMemo(() => {
    const result = STORE_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All Components' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'Price: Low-High': result.sort((a, b) => a.price - b.price); break;
      case 'Price: High-Low': result.sort((a, b) => b.price - a.price); break;
      case 'Rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'Popularity': default: break;
    }
    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const displayedItems = sortedAndFilteredItems.slice(0, visibleCount);

  const handleAddToCart = (id: string) => {
    setIsAddingToCart(id);
    const item = STORE_ITEMS.find(i => i.id === id);
    setTimeout(() => {
      setCartCount(prev => prev + 1);
      setIsAddingToCart(null);
      setToast(`Added ${item?.title || 'item'} to cart`);
      setTimeout(() => setToast(null), 3000);
    }, 600);
  };

  return (
    <div className="h-full w-full bg-background text-foreground overflow-y-auto selection:bg-primary/20">
      <div className="max-w-[1600px] mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-black text-foreground">HARDWARE STORE</h1>
            <p className="text-muted-foreground text-[13px] mt-1 font-medium">80+ Professional sensors, modules and microcontrollers ready for simulation.</p>
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-96 group">
              <SafeIcon icon={Search} size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search catalog..."
                className="w-full h-10 bg-card border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-card border border-border rounded-xl px-3 h-10 gap-2 cursor-pointer hover:border-primary/50 transition-colors relative group">
              <SafeIcon icon={ArrowUpDown} size={14} className="text-muted-foreground" />
              <select
                className="bg-transparent text-[12px] font-bold text-foreground outline-none cursor-pointer appearance-none pr-4"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Popularity">Popularity</option>
                <option value="Price: Low-High">Price: Low-High</option>
                <option value="Price: High-Low">Price: High-Low</option>
                <option value="Rating">Rating</option>
              </select>
              <SafeIcon icon={ChevronDown} size={12} className="absolute right-3 text-muted-foreground pointer-events-none" />
            </div>

            <button className="relative h-10 w-10 flex items-center justify-center bg-card border border-border rounded-xl hover:bg-secondary transition-all active:scale-95 shadow-sm">
              <SafeIcon icon={ShoppingCart} size={18} className="text-foreground" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-[9px] font-black flex items-center justify-center rounded-full text-primary-foreground ring-2 ring-background">{cartCount}</span>}
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-1.5 mr-2 text-muted-foreground">
             <SafeIcon icon={Filter} size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">FILTER</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleCount(20); }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all border
                ${selectedCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {isLoading ? (
            Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayedItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                setPreviewItem={setPreviewItem}
                handleAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && displayedItems.length === 0 && (
          <div className="py-20 text-center">
            <SafeIcon icon={Search} size={40} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-bold text-foreground">No components found</h2>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* Load More */}
        {!isLoading && sortedAndFilteredItems.length > visibleCount && (
          <div className="mt-12 flex flex-col items-center gap-4">
             <p className="text-[12px] font-medium text-muted-foreground tracking-wide uppercase">Showing {visibleCount} of {sortedAndFilteredItems.length} products</p>
             <button
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="px-8 h-12 bg-card hover:bg-secondary border border-border hover:border-primary/50 text-foreground text-sm font-bold rounded-xl transition-all active:scale-95"
             >
               Load More Components
             </button>
          </div>
        )}
      </div>

      {/* Quick Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewItem(null)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <button onClick={() => setPreviewItem(null)} className="absolute top-4 right-4 z-10 p-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"><SafeIcon icon={X} size={18} /></button>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/2 bg-muted p-8 flex items-center justify-center min-h-[300px]">
                  <img src={previewItem.image} alt={previewItem.title} className="max-w-full h-auto object-contain drop-shadow-md" />
                </div>
                <div className="sm:w-1/2 p-8 flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{previewItem.category}</span>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{previewItem.title}</h2>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded border border-border">
                      <SafeIcon icon={Star} size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[12px] font-bold text-foreground">{previewItem.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">{previewItem.reviewsCount} Reviews</span>
                  </div>
                  <p className="text-muted-foreground text-[13px] leading-relaxed mb-6 font-medium">{previewItem.shortDescription}</p>

                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block">PRICE</span>
                      <span className="text-2xl font-black text-foreground tracking-tight">₹{previewItem.price.toFixed(0)}</span>
                    </div>
                    <button onClick={() => { handleAddToCart(previewItem.id); setPreviewItem(null); }} className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                       <SafeIcon icon={ShoppingCart} size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-success text-primary-foreground text-sm font-bold rounded-full shadow-lg flex items-center gap-3"
          >
            <SafeIcon icon={Check} size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePage;
