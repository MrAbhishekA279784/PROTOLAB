import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users2,
  Search,
  ExternalLink,
  Github,
  Twitter,
  Globe,
  MapPin,
  Briefcase,
  Code2,
  Star,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_DEVELOPERS } from "../data/mock-data";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function DevelopersTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevs = MOCK_DEVELOPERS.filter((dev) => {
    return dev.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
           dev.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           dev.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center shadow-inner">
              <Users2 className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Developers</h2>
              <p className="text-[12px] text-muted-foreground">Discover and connect with the community</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or language..."
              className="pl-9 bg-background/50 border-white/5 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all h-9 text-sm rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredDevs.map((dev, index) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group p-5 rounded-2xl bg-card/40 border border-white/5 hover:border-cyan-500/30 hover:bg-card/60 transition-all shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center text-2xl font-bold text-cyan-500 border border-white/5 shadow-inner">
                    {dev.avatar ? (
                      <img src={dev.avatar} alt={dev.username} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      dev.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card shadow-sm" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground group-hover:text-cyan-400 transition-colors truncate">
                    {dev.displayName}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">@{dev.username}</p>
                  
                  <div className="flex items-center gap-3 mt-2 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="font-semibold text-foreground/80">{dev.followers}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      <span className="font-semibold text-foreground/80">{dev.projectsCount}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4 line-clamp-2 leading-relaxed italic">
                "{dev.bio}"
              </p>

              <div className="flex flex-wrap items-center gap-1.5 mt-4">
                {dev.languages.slice(0, 3).map(lang => (
                  <span 
                    key={lang}
                    className="px-2 py-0.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[10px] font-bold text-cyan-400 uppercase tracking-tight"
                  >
                    {lang}
                  </span>
                ))}
                {dev.languages.length > 3 && (
                  <span className="text-[10px] text-muted-foreground font-medium pl-1">+{dev.languages.length - 3} more</span>
                )}
              </div>

              <div className="mt-auto pt-5 flex items-center gap-2">
                <button className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                  dev.isFollowing 
                    ? "bg-secondary text-foreground hover:bg-secondary/80" 
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-95"
                )}>
                  {dev.isFollowing ? "Following" : "Follow"}
                </button>
                <Link 
                  to={`/profile/${dev.username}`}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
          
          {filteredDevs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-60">
              <Users2 className="w-12 h-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No developers found</h3>
              <p className="text-sm">Try searching for a different name or language</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
