import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitFork,
  CircleDot,
  MessageSquare,
  UserPlus,
  Clock,
  Search,
  Sparkles,
  ArrowUpRight,
  Heart,
  Zap,
  TrendingUp,
  ExternalLink,
  Plus,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_FEED_ITEMS } from "../data/mock-data";
import type { FeedItem } from "../types";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getFeedIcon(type: FeedItem["type"]) {
  switch (type) {
    case "project":
      return { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" };
    case "star":
      return { icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" };
    case "fork":
      return { icon: GitFork, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "discussion":
      return { icon: MessageSquare, color: "text-violet-500", bg: "bg-violet-500/10" };
    case "follow":
      return { icon: UserPlus, color: "text-sky-500", bg: "bg-sky-500/10" };
    default:
      return { icon: CircleDot, color: "text-muted-foreground", bg: "bg-secondary" };
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function FeedTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FeedItem["type"] | "all">("all");

  const filteredItems = MOCK_FEED_ITEMS.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.actor.toLowerCase().includes(q) ||
      item.target.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filterButtons: { id: FeedItem["type"] | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "project", label: "Projects" },
    { id: "star", label: "Stars" },
    { id: "fork", label: "Forks" },
    { id: "discussion", label: "Discussions" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
              <Zap className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Activity Feed</h2>
              <p className="text-[12px] text-muted-foreground">Stay updated with the community's latest projects</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold rounded-full border-primary/20 hover:bg-primary/5">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> Trending
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            className="pl-9 h-9 text-[13px] bg-background/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {filterButtons.map((fb) => (
            <button
              key={fb.id}
              onClick={() => setFilter(fb.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
                filter === fb.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">No activity found</h3>
              <p className="text-[12px] text-muted-foreground/70">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-1"
            >
              {filteredItems.map((item) => {
                const { icon: FeedIcon, color, bg } = getFeedIcon(item.type);
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-all duration-200 cursor-pointer"
                  >
                    {/* Timeline line */}
                    <div className="absolute left-[26px] top-[42px] bottom-0 w-[1.5px] bg-border/40 group-last:hidden" />

                    {/* Icon */}
                    <div className={`relative z-10 w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                      <FeedIcon className={`w-4 h-4 ${color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] leading-snug">
                        <span className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                          {item.actor}
                        </span>{" "}
                        <span className="text-muted-foreground">{item.description}</span>{" "}
                        <span className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                          {item.target}
                        </span>
                      </p>

                      {/* Metadata chips */}
                      {item.metadata && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {Object.entries(item.metadata).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-secondary/80 text-[10px] font-medium text-muted-foreground"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground/70">
                        <Clock className="w-3 h-3" />
                        {timeAgo(item.timestamp)}
                      </div>
                    </div>

                    {/* Hover action */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats Bar */}
      <div className="px-6 py-3 border-t border-border bg-card/30 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-red-400" />
          {filteredItems.length} activities shown
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          Updated just now
        </span>
      </div>
    </div>
  );
}
