import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Search,
  ThumbsUp,
  Pin,
  CheckCircle2,
  Clock,
  MessageSquare,
  Tag,
  ChevronDown,
  Filter,
  Megaphone,
  Lightbulb,
  HelpCircle,
  Presentation,
  Hash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_DISCUSSIONS } from "../data/mock-data";
import type { Discussion, DiscussionCategory } from "../types";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CATEGORY_CONFIG: Record<
  DiscussionCategory,
  { label: string; icon: typeof MessageCircle; color: string; bg: string }
> = {
  general: { label: "General", icon: Hash, color: "text-slate-500", bg: "bg-slate-500/10" },
  ideas: { label: "Ideas", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
  "q-and-a": { label: "Q&A", icon: HelpCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "show-and-tell": {
    label: "Show & Tell",
    icon: Presentation,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  announcements: {
    label: "Announcements",
    icon: Megaphone,
    color: "text-primary",
    bg: "bg-primary/10",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function DiscussionsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<DiscussionCategory | "all">("all");
  const [showCategories, setShowCategories] = useState(false);

  const categories = Object.entries(CATEGORY_CONFIG) as [DiscussionCategory, (typeof CATEGORY_CONFIG)[DiscussionCategory]][];

  const filteredDiscussions = MOCK_DISCUSSIONS.filter((disc) => {
    const matchesCat = categoryFilter === "all" || disc.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      disc.title.toLowerCase().includes(q) ||
      disc.author.toLowerCase().includes(q) ||
      disc.labels.some((l) => l.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    // Pinned first, then by date
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center shadow-inner">
              <MessageCircle className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Discussions</h2>
              <p className="text-[12px] text-muted-foreground">Join the conversation and solve problems together</p>
            </div>
          </div>
          <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            New Discussion
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-9 h-9 text-[13px] bg-background/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
              categoryFilter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            All
          </button>
          {categories.map(([id, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={id}
                onClick={() => setCategoryFilter(id)}
                className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
                  categoryFilter === id
                    ? `${config.bg} ${config.color} shadow-sm`
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discussion List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {filteredDiscussions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <MessageCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">No discussions found</h3>
              <p className="text-[12px] text-muted-foreground/70">
                Start a new discussion or adjust your filters
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-border"
            >
              {filteredDiscussions.map((disc) => (
                <DiscussionCard key={disc.id} discussion={disc} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DiscussionCard({ discussion }: { discussion: Discussion }) {
  const [upvoted, setUpvoted] = useState(false);
  const cat = CATEGORY_CONFIG[discussion.category];
  const CatIcon = cat.icon;
  const displayUpvotes = upvoted ? discussion.upvotes + 1 : discussion.upvotes;

  return (
    <motion.div
      variants={cardVariants}
      className="group px-6 py-4 hover:bg-secondary/30 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* Upvote */}
        <div className="flex flex-col items-center gap-0.5 pt-0.5">
          <button
            onClick={() => setUpvoted((u) => !u)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              upvoted
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${upvoted ? "fill-primary" : ""}`} />
          </button>
          <span
            className={`text-[11px] font-semibold ${
              upvoted ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {displayUpvotes}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Pinned */}
            {discussion.isPinned && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}

            {/* Category badge */}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium ${cat.bg} ${cat.color}`}
            >
              <CatIcon className="w-3 h-3" />
              {cat.label}
            </span>

            {/* Answered badge */}
            {discussion.isAnswered && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                Answered
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[14px] font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors cursor-pointer">
            {discussion.title}
          </h3>

          {/* Body preview */}
          <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
            {discussion.body}
          </p>

          {/* Labels */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {discussion.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 cursor-pointer transition-colors"
              >
                <Tag className="w-2.5 h-2.5" />
                {label}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{discussion.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(discussion.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {discussion.replies} replies
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
