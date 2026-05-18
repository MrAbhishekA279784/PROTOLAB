import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Search, FolderGit2, Clock, Filter,
  LayoutGrid, List, ArrowUpDown, Plus, History,
  Sparkles, Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { useStore, Post } from "@/store/useStore";
import { SafeIcon } from "@/components/ui/safe-icon";

const CATEGORIES = [
  "All", "Arduino", "ESP32", "IoT", "Robotics", 
  "PCB", "Simulation", "Automation", "Embedded Systems"
];

type SortOption = "latest" | "popular" | "stars";

export default function RepositoriesTab() {
  const { posts, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavorites, setShowFavorites] = useState(false);

  // Filter and Sort Projects
  const filteredProjects = useMemo(() => {
    let result = posts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === "All" || 
                              p.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase()) ||
                              p.type.toLowerCase().includes(activeCategory.toLowerCase());
      
      const matchesFavorites = !showFavorites || p.starredBy?.includes(currentUser?.id || '');
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (sortBy === "latest") {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.views - a.views);
    } else if (sortBy === "stars") {
      result = [...result].sort((a, b) => (b.starredBy?.length || 0) - (a.starredBy?.length || 0));
    }

    return result;
  }, [posts, searchQuery, activeCategory, sortBy, showFavorites, currentUser]);

  const recentProjects = useMemo(() => {
    return posts
      .filter(p => p.lastOpened)
      .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
      .slice(0, 3);
  }, [posts]);

  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Search & Filter Header */}
      <div className="p-8 border-b border-border/50 bg-card/30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <FolderGit2 className="text-primary w-8 h-8" />
              Project Hub
            </h2>
            <p className="text-sm text-muted-foreground font-medium">Manage and explore engineering workspaces</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-border/50 hover:bg-secondary flex items-center gap-2">
              <SafeIcon icon={Plus} size={16} /> New Project
            </Button>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2">
              <SafeIcon icon={Zap} size={16} /> Create with AI
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search projects by name, tags, or components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background/50 border-border/50 rounded-2xl focus:border-primary transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-card border-border/50 text-muted-foreground hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Recently Opened Section */}
        {recentProjects.length > 0 && !searchQuery && !showFavorites && (
          <section className="mb-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <History size={14} /> Recently Opened
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map(p => (
                <ProjectCard key={`recent-${p.id}`} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* Filters & Sort Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                showFavorites ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-400/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star size={14} fill={showFavorites ? "currentColor" : "none"} />
              Favorites
            </button>
            <div className="h-4 w-[1px] bg-border/50" />
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              <ArrowUpDown size={14} />
              Sort: 
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent outline-none text-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
                <option value="stars">Stars</option>
              </select>
            </div>
          </div>

          <div className="flex items-center bg-card border border-border/50 rounded-xl p-1">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? 'bg-secondary text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? 'bg-secondary text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
                <Search size={32} className="text-muted-foreground/30" />
              </div>
              <h4 className="text-xl font-black text-foreground mb-2">No projects found</h4>
              <p className="text-sm text-muted-foreground max-w-xs">We couldn't find any projects matching your current filters. Try resetting them.</p>
            </motion.div>
          ) : (
            <motion.div 
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-4"
              }
            >
              {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
