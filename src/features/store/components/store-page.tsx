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
  X,
  Heart,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  Package,
  ArrowRight,
  Bot,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORE_ITEMS, StoreItem, getRelatedProducts } from '@/features/store/data/store-data';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

// --- Sub-components ---

function ProductCard({ 
  item, 
  setPreviewItem, 
  handleAddToCart, 
  isAddingToCart, 
  onAddToSim 
}: { 
  item: StoreItem; 
  setPreviewItem: (item: StoreItem) => void; 
  handleAddToCart: (id: string) => void; 
  isAddingToCart: boolean; 
  onAddToSim?: (id: string) => void 
}) {
  const { wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(item.id);

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="relative h-52 overflow-hidden bg-secondary/30 flex items-center justify-center p-6 cursor-pointer group/img" onClick={() => setPreviewItem(item)}>
        <motion.img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="max-w-full max-h-full object-contain drop-shadow-xl"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        />
        
        {/* Badges & Actions */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.badge && (
            <div className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              {item.badge}
            </div>
          )}
          {item.stock === 'Limited Stock' && (
             <div className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-lg shadow-amber-500/20">
               Limited
             </div>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 z-10",
            isWishlisted ? "bg-red-500 text-white" : "bg-white/10 text-muted-foreground hover:bg-white/20 hover:text-foreground"
          )}
        >
          <SafeIcon icon={Heart} size={14} className={isWishlisted ? "fill-current" : ""} />
        </button>

        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-2 bg-gradient-to-t from-background/90 to-transparent backdrop-blur-[1px]">
           <button
             onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
             className="flex-1 h-9 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-[11px] rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
           >
             <SafeIcon icon={Eye} size={14} /> Quick View
           </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">{item.category}</span>
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
            <SafeIcon icon={Star} size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-amber-600">{item.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
        <p className="text-[12px] text-muted-foreground font-medium mb-4 line-clamp-1 opacity-80">{item.shortDescription}</p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50 gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Price</span>
            <span className="text-lg font-black text-foreground tracking-tight">₹{item.price.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToSim?.(item.id)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-border"
              title="Add to Workspace"
            >
              <SafeIcon icon={Plus} size={16} />
            </button>
            <button
              disabled={isAddingToCart}
              onClick={() => handleAddToCart(item.id)}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90",
                isAddingToCart ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {isAddingToCart ? <SafeIcon icon={Check} size={20} /> : <SafeIcon icon={ShoppingCart} size={18} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Component ---

const CATEGORIES = [
  'All Products',
  'Arduino',
  'ESP32',
  'Sensors',
  'Modules',
  'PCB Tools',
  'Motors',
  'Displays',
  'Power Supplies',
  'Robotics',
  'IoT'
];

const StorePage = () => {
  const { cart, addToCart, wishlist, toggleWishlist, theme } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');
  const [previewItem, setPreviewItem] = useState<StoreItem | null>(null);
  const [previewTab, setPreviewTab] = useState('Overview');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    return STORE_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All Products' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const sortedItems = useMemo(() => {
    const result = [...filteredItems];
    switch (sortBy) {
      case 'Price: Low-High': result.sort((a, b) => a.price - b.price); break;
      case 'Price: High-Low': result.sort((a, b) => b.price - a.price); break;
      case 'Rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'Trending': result.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
      default: break;
    }
    return result;
  }, [filteredItems, sortBy]);

  const displayedItems = sortedItems.slice(0, visibleCount);

  const handleAddToCart = (id: string) => {
    setAddingId(id);
    addToCart(id);
    setTimeout(() => setAddingId(null), 1000);
  };

  const trendingProducts = useMemo(() => {
    return STORE_ITEMS.slice(0, 4); // Just a sample
  }, []);

  const handleAddToSim = (id: string) => {
    const item = STORE_ITEMS.find(i => i.id === id);
    // In a real app, this would add the component to the active simulation project
    // For now, we show a success feedback
    console.log(`Adding ${id} to simulation workspace`);
  };

  return (
    <div className="h-full w-full bg-background text-foreground overflow-y-auto selection:bg-primary/20 custom-scrollbar">
      {/* Promotional Hero Section */}
      <section className="relative w-full py-16 px-6 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <SafeIcon icon={Zap} size={12} /> Pro-Level Engineering Store
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-foreground">
              BUILD YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">NEXT BRAINSTORM.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
              Verified high-precision microcontrollers, sensors, and modular components curated for professional makers and research labs.
            </p>
            <div className="flex items-center gap-4">
              <button className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                Explore Best Sellers
              </button>
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-black">
                     U{i}
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black">
                   +2k
                 </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block flex-1 relative">
             <motion.div 
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="w-full aspect-square bg-gradient-to-br from-primary/20 to-violet-500/10 rounded-3xl border border-white/5 backdrop-blur-3xl flex items-center justify-center p-12"
             >
                <SafeIcon icon={Cpu} size={120} className="text-primary/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="w-64 h-64 border-2 border-dashed border-primary/20 rounded-full" 
                   />
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 py-12 space-y-20">

        {/* Global Store Stats & AI Advice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 rounded-3xl bg-secondary/30 border border-border flex items-center gap-5 group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <SafeIcon icon={ShieldCheck} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Verified Hardware</h3>
                <p className="text-xs text-muted-foreground">Industrial grade QC standards</p>
              </div>
           </div>
           <div className="p-6 rounded-3xl bg-secondary/30 border border-border flex items-center gap-5 group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <SafeIcon icon={Package} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Instant Simulation</h3>
                <p className="text-xs text-muted-foreground">Add directly to your workspace</p>
              </div>
           </div>
           {/* Proto AI Recommendation Card */}
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="p-6 rounded-3xl bg-primary text-primary-foreground flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-primary/20"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <SafeIcon icon={Sparkles} size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                   <SafeIcon icon={Bot} size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Proto AI Suggestion</span>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-2">Build a Smart Home Hub?</h3>
                <p className="text-xs opacity-70 mb-4 line-clamp-2">"Based on your recent ESP32 projects, I recommend the MQ-135 Gas Sensor and OLED Display for air quality monitoring."</p>
              </div>
              <button className="relative z-10 w-fit text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Shop recommended <SafeIcon icon={ArrowRight} size={14} />
              </button>
           </motion.div>
        </div>

        {/* Featured Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <SafeIcon icon={TrendingUp} size={20} />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight">TRENDING COMPONENTS</h2>
              </div>
              <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="h-[340px] bg-secondary/30 rounded-2xl animate-pulse" />) : 
                trendingProducts.map(item => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    setPreviewItem={setPreviewItem} 
                    handleAddToCart={handleAddToCart}
                    isAddingToCart={addingId === item.id}
                    onAddToSim={handleAddToSim}
                  />
                ))
              }
           </div>
        </section>

        {/* Main Catalog Section */}
        <section className="space-y-8 pt-10 border-t border-border/50">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-black tracking-tight mb-2">ENGINEERING CATALOG</h2>
              <p className="text-muted-foreground font-medium text-sm">Browse our full collection of verified hardware components.</p>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 xl:w-80 group">
                <SafeIcon icon={Search} size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search parts, specs..."
                  className="w-full h-12 bg-secondary/50 border border-border rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:border-primary transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative group">
                <SafeIcon icon={ArrowUpDown} size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  className="h-12 pl-10 pr-10 bg-secondary/50 border border-border rounded-2xl text-[12px] font-bold outline-none cursor-pointer appearance-none hover:border-primary/40 transition-all"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Price: Low-High">Price: Low-High</option>
                  <option value="Price: High-Low">Price: High-Low</option>
                  <option value="Rating">Top Rated</option>
                  <option value="Trending">Popularity</option>
                </select>
                <SafeIcon icon={ChevronDown} size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(15); }}
                className={cn(
                  "whitespace-nowrap px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all border",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                    : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {isLoading ? (
              Array(10).fill(0).map((_, i) => <div key={i} className="h-[380px] bg-secondary/30 rounded-2xl animate-pulse" />)
            ) : (
              displayedItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  setPreviewItem={setPreviewItem}
                  handleAddToCart={handleAddToCart}
                  isAddingToCart={addingId === item.id}
                  onAddToSim={handleAddToSim}
                />
              ))
            )}
          </div>

          {/* Empty State */}
          {!isLoading && displayedItems.length === 0 && (
            <div className="py-32 text-center bg-secondary/20 rounded-[40px] border border-dashed border-border">
              <SafeIcon icon={Search} size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-bold text-foreground">Hardware not found</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">We couldn't find any components matching "{searchQuery}". Try different keywords.</p>
            </div>
          )}

          {/* Load More */}
          {!isLoading && sortedItems.length > visibleCount && (
            <div className="pt-12 flex justify-center">
               <button
                  onClick={() => setVisibleCount(prev => prev + 15)}
                  className="group px-10 h-14 bg-card hover:bg-secondary border border-border hover:border-primary/50 text-foreground text-sm font-bold rounded-2xl transition-all active:scale-95 flex items-center gap-3"
               >
                 View More Components
                 <SafeIcon icon={ArrowDown} size={16} className="group-hover:translate-y-1 transition-transform" />
               </button>
            </div>
          )}
        </section>
      </div>

      {/* Advanced Product Detail Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewItem(null)} className="absolute inset-0 bg-background/90 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-5xl bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
            >
              <button 
                onClick={() => setPreviewItem(null)} 
                className="absolute top-6 right-6 z-20 p-2.5 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground rounded-full transition-colors backdrop-blur-md"
              >
                <SafeIcon icon={X} size={20} />
              </button>

              {/* Left Side: Images & Gallery */}
              <div className="md:w-[45%] bg-secondary/50 p-8 flex flex-col border-b md:border-b-0 md:border-r border-border overflow-y-auto">
                 <div className="flex-1 flex items-center justify-center min-h-[300px]">
                    <motion.img 
                      layoutId={`img-${previewItem.id}`}
                      src={previewItem.image} 
                      alt={previewItem.title} 
                      className="max-w-full max-h-[400px] object-contain drop-shadow-2xl" 
                    />
                 </div>
                 <div className="flex gap-3 justify-center mt-8">
                    {previewItem.gallery.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-2xl border border-border bg-card p-2 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
                        <img src={img} className="w-full h-full object-contain" />
                      </div>
                    ))}
                 </div>
                 
                 {/* Spec List */}
                 <div className="mt-12 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Technical Specs</h4>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.entries(previewItem.specs).map(([k, v]) => (
                         <div key={k} className="p-3 rounded-2xl bg-card border border-border/50">
                            <span className="text-[9px] font-black text-muted-foreground block uppercase mb-1">{k}</span>
                            <span className="text-xs font-bold text-foreground">{v}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Right Side: Info & Actions */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                  <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">{previewItem.category}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <SafeIcon icon={Star} size={14} className="fill-current" />
                          <span className="text-sm font-black">{previewItem.rating}</span>
                          <span className="text-xs text-muted-foreground font-medium ml-1">({previewItem.reviewsCount} Reviews)</span>
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">{previewItem.title}</h2>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{previewItem.stock}</span>
                         </div>
                         <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">SKU: {previewItem.id.toUpperCase()}</div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border">
                       {['Overview', 'Specifications', 'Wiring', 'Reviews'].map(tab => (
                         <button 
                           key={tab}
                           onClick={() => setPreviewTab(tab)}
                           className={cn(
                             "px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative",
                             previewTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                           )}
                         >
                           {tab}
                           {previewTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                         </button>
                       ))}
                    </div>

                    <div className="min-h-[300px]">
                      {previewTab === 'Overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <p className="text-muted-foreground text-[15px] leading-relaxed font-medium">{previewItem.fullDescription}</p>
                          
                          {/* AI Quick Advice */}
                          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <SafeIcon icon={Sparkles} size={80} />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                               <SafeIcon icon={Bot} size={18} className="text-primary" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Proto AI Recommendation</span>
                            </div>
                            <p className="text-[13px] font-semibold text-foreground/90 italic leading-relaxed">"Based on our internal simulations, this component performs optimally when powered by a stable {previewItem.specs['Voltage'] || '5V'} source with decoupled grounds."</p>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                               <SafeIcon icon={ArrowRight} size={12} /> You might also need
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {getRelatedProducts(previewItem.category, previewItem.id, 2).map(p => (
                                 <div key={p.id} onClick={() => setPreviewItem(p)} className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-all cursor-pointer group/related">
                                    <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center p-2 group-hover/related:scale-110 transition-transform">
                                       <img src={p.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                       <p className="text-[12px] font-bold text-foreground line-clamp-1">{p.title}</p>
                                       <p className="text-[11px] font-black text-primary">₹{p.price.toLocaleString()}</p>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {previewTab === 'Specifications' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          {Object.entries(previewItem.specs).map(([k, v]) => (
                            <div key={k} className="p-4 rounded-2xl bg-secondary/30 border border-border">
                               <span className="text-[10px] font-black text-muted-foreground block uppercase mb-1 tracking-widest">{k}</span>
                               <span className="text-sm font-bold text-foreground">{v}</span>
                            </div>
                          ))}
                          <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                             <span className="text-[10px] font-black text-muted-foreground block uppercase mb-1 tracking-widest">Weight</span>
                             <span className="text-sm font-bold text-foreground">12.5g</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                             <span className="text-[10px] font-black text-muted-foreground block uppercase mb-1 tracking-widest">Warranty</span>
                             <span className="text-sm font-bold text-foreground">1 Year Replacement</span>
                          </div>
                        </div>
                      )}

                      {previewTab === 'Wiring' && (
                         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="aspect-video w-full rounded-3xl bg-slate-950 border border-border flex items-center justify-center relative overflow-hidden group">
                               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                               <div className="flex flex-col items-center gap-4 relative z-10">
                                  <SafeIcon icon={Zap} size={48} className="text-primary animate-pulse" />
                                  <div className="text-center">
                                     <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Logic Wiring Diagram</p>
                                     <p className="text-[10px] text-slate-500">Interactive schematic available in Workspace</p>
                                  </div>
                               </div>
                               {/* Mock wires */}
                               <div className="absolute inset-0 pointer-events-none opacity-20">
                                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary" />
                                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-violet-500" />
                                  <div className="absolute top-1/4 right-0 w-1/2 h-[1px] bg-emerald-500" />
                               </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-secondary/30 border border-border">
                               <h5 className="text-[11px] font-black uppercase tracking-widest mb-3 text-primary">Pinout Instructions</h5>
                               <ul className="space-y-3">
                                  {[
                                    'VCC: Connect to 3.3V/5V DC source',
                                    'GND: Common ground with MCU',
                                    'SDA: Serial Data (I2C) to A4/D21',
                                    'SCL: Serial Clock (I2C) to A5/D22'
                                  ].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                       <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {text}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      )}

                      {previewTab === 'Reviews' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          {previewItem.mockReviews.map((review, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-secondary/30 border border-border space-y-3">
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                        {review.user.charAt(0)}
                                     </div>
                                     <span className="text-xs font-bold">{review.user}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                     {Array(5).fill(0).map((_, idx) => (
                                       <SafeIcon key={idx} icon={Star} size={10} className={idx < review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"} />
                                     ))}
                                  </div>
                               </div>
                               <p className="text-xs text-muted-foreground leading-relaxed italic">"{review.text}"</p>
                               <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">{review.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-8 md:p-12 border-t border-border bg-card/50 backdrop-blur-md flex items-center gap-6 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Subtotal</span>
                    <span className="text-3xl font-black text-foreground tracking-tight">₹{previewItem.price.toLocaleString()}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <button 
                      onClick={() => { handleAddToCart(previewItem.id); }} 
                      className="flex-1 h-14 bg-primary text-primary-foreground font-black text-sm rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <SafeIcon icon={ShoppingCart} size={20} /> ADD TO CART
                    </button>
                    <button 
                      onClick={() => toggleWishlist(previewItem.id)}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all border",
                        wishlist.includes(previewItem.id) ? "bg-red-500 text-white border-red-500" : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <SafeIcon icon={Heart} size={20} className={wishlist.includes(previewItem.id) ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePage;
