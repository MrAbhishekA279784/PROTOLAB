import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  FolderGit2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Star,
  Flame,
  Search,
  CircleDot,
  GitPullRequest,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { CommunityTab } from "../types";

interface CommunitySidebarProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

const NAV_ITEMS: { id: CommunityTab; label: string; icon: typeof Newspaper; badge?: number }[] = [
  { id: "feed", label: "Feed", icon: Newspaper },
  { id: "repositories", label: "Repositories", icon: FolderGit2 },
  { id: "discussions", label: "Discussions", icon: MessageCircle, badge: 3 },
  { id: "issues", label: "Issues", icon: CircleDot },
  { id: "pull-requests", label: "Pull Requests", icon: GitPullRequest },
  { id: "developers", label: "Developers", icon: Users2 },
];

const PINNED_REPOS = [
  { name: "smart-irrigation", color: "#f34b7d" },
  { name: "oscilloscope-diy", color: "#555555" },
  { name: "motor-driver-pcb", color: "#2b7489" },
];

const TRENDING_TOPICS = [
  { label: "esp32", count: 128 },
  { label: "arduino", count: 96 },
  { label: "pcb-design", count: 74 },
  { label: "iot", count: 61 },
  { label: "stm32", count: 45 },
];

export default function CommunitySidebar({ activeTab, onTabChange }: CommunitySidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative h-full flex flex-col border-r border-border bg-card/50 backdrop-blur-sm shrink-0 overflow-hidden"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <h2 className="text-sm font-bold tracking-tight whitespace-nowrap">Community</h2>
              <p className="text-[11px] text-muted-foreground whitespace-nowrap">Explore & Connect</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Separator */}
      <div className="mx-3 border-b border-border/60" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <div className="px-2.5 mb-4 space-y-3">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Navigate
              </span>
              <div className="relative group/search">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                <Input
                  placeholder="Filter..."
                  className="h-8 pl-8 text-[12px] bg-secondary/40 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-lg transition-all duration-200 group relative",
                collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />

              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="text-[13px] whitespace-nowrap flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Badge */}
              {item.badge && !collapsed && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow-sm">
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 rounded-md bg-popover border border-border text-xs font-medium text-popover-foreground shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

        {/* Pinned Section */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 space-y-1"
            >
              <span className="block px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Pinned
              </span>
              {PINNED_REPOS.map((repo) => (
                <button
                  key={repo.name}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all group"
                >
                  <div className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: repo.color }} />
                  <span className="text-[12px] truncate">{repo.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Trending Topics — only when expanded */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-4 overflow-hidden"
          >
            <div className="border-t border-border/60 pt-3">
              <div className="flex items-center gap-1.5 px-1 mb-2.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Trending Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_TOPICS.map((topic) => (
                  <span
                    key={topic.label}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/80 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <span className="text-primary/60">#</span>
                    {topic.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats — only when expanded */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-4 overflow-hidden"
          >
            <div className="border-t border-border/60 pt-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Active Projects
                </span>
                <span className="text-[11px] font-semibold text-foreground">1,247</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Star className="w-3 h-3" /> Total Stars
                </span>
                <span className="text-[11px] font-semibold text-foreground">8,932</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Members
                </span>
                <span className="text-[11px] font-semibold text-foreground">3,461</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
