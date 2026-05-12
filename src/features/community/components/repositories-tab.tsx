import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitFork,
  Search,
  FolderGit2,
  Clock,
  Eye,
  Lock,
  ArrowUpDown,
  Code2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_REPOSITORIES } from "../data/mock-data";
import type { Repository } from "../types";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type SortOption = "stars" | "forks" | "updated";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function RepositoriesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all");

  // Extract unique languages
  const languages = Array.from(new Set(MOCK_REPOSITORIES.map((r) => r.language)));

  const filteredRepos = MOCK_REPOSITORIES.filter((repo) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      repo.name.toLowerCase().includes(q) ||
      repo.description.toLowerCase().includes(q) ||
      repo.owner.toLowerCase().includes(q) ||
      repo.topics.some((t) => t.toLowerCase().includes(q));
    const matchesLang = selectedLanguage === "all" || repo.language === selectedLanguage;
    return matchesSearch && matchesLang;
  }).sort((a, b) => {
    if (sortBy === "stars") return b.stars - a.stars;
    if (sortBy === "forks") return b.forks - a.forks;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center shadow-inner">
              <FolderGit2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Repositories</h2>
              <p className="text-[12px] text-muted-foreground">Explore community projects and source code</p>
            </div>
          </div>
          <Button className="rounded-full shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2">
            <Plus className="w-4 h-4" /> New Repository
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find a repository..."
              className="pl-9 h-9 text-[13px] bg-background/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-background text-[12px] text-foreground appearance-none cursor-pointer hover:bg-secondary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-0.5 bg-secondary/60 rounded-lg p-0.5">
              {(["stars", "forks", "updated"] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                    sortBy === opt
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt === "stars" && "★ Stars"}
                  {opt === "forks" && "⑂ Forks"}
                  {opt === "updated" && "↻ Recent"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Repository List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {filteredRepos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <FolderGit2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">No repositories found</h3>
              <p className="text-[12px] text-muted-foreground/70">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-border"
            >
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RepoCard({ repo }: { repo: Repository }) {
  const [starred, setStarred] = useState(false);
  const displayStars = starred ? repo.stars + 1 : repo.stars;

  return (
    <motion.div
      variants={cardVariants}
      className="group px-6 py-4 hover:bg-secondary/30 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Repo Name */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] text-muted-foreground">{repo.owner}</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-[14px] font-semibold text-primary hover:underline cursor-pointer">
              {repo.name}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                repo.visibility === "public"
                  ? "border-border text-muted-foreground"
                  : "border-amber-500/30 text-amber-600 bg-amber-500/5"
              }`}
            >
              {repo.visibility === "private" && <Lock className="w-2.5 h-2.5" />}
              {repo.visibility}
            </span>
          </div>

          {/* Description */}
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {repo.description}
          </p>

          {/* Topics */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-full bg-primary/8 text-primary text-[11px] font-medium hover:bg-primary/15 cursor-pointer transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            {/* Language */}
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: repo.languageColor }}
              />
              {repo.language}
            </span>

            {/* Stars */}
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {displayStars.toLocaleString()}
            </span>

            {/* Forks */}
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {repo.forks.toLocaleString()}
            </span>

            {/* Updated */}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {timeAgo(repo.updatedAt)}
            </span>
          </div>
        </div>

        {/* Star Button */}
        <button
          onClick={() => setStarred((s) => !s)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all duration-200 ${
            starred
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${starred ? "fill-amber-500 text-amber-500" : ""}`} />
          {starred ? "Starred" : "Star"}
        </button>
      </div>
    </motion.div>
  );
}
