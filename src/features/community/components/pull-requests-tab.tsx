import { useState } from "react";
import { motion } from "framer-motion";
import {
  GitPullRequest,
  GitMerge,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  GitBranch,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PULL_REQUESTS } from "../data/mock-data";
import { cn } from "@/lib/utils";

export default function PullRequestsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "merged">("all");

  const filteredPRs = MOCK_PULL_REQUESTS.filter((pr) => {
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pr.repoName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || pr.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center shadow-inner">
              <GitPullRequest className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Pull Requests</h2>
              <p className="text-[12px] text-muted-foreground">Manage contributions and code reviews</p>
            </div>
          </div>
          <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            New PR
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pull requests..."
              className="pl-9 bg-background/50 border-white/5 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all h-9 text-sm rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-background/50 p-1 rounded-xl border border-white/5">
            {(["all", "open", "merged"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1 rounded-lg text-xs font-medium capitalize transition-all",
                  filter === f 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-4 max-w-5xl mx-auto">
          {filteredPRs.map((pr, index) => (
            <motion.div
              key={pr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group p-4 rounded-2xl bg-card/40 border border-white/5 hover:border-blue-500/30 hover:bg-card/60 transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/5"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  pr.status === "open" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                )}>
                  {pr.status === "open" ? <GitPullRequest className="w-4 h-4" /> : <GitMerge className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-400 transition-colors truncate leading-tight">
                      {pr.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 bg-white/5 px-2 py-0.5 rounded-full">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{pr.comments}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-[12px] text-muted-foreground">
                    <span className="font-medium text-foreground/70">#{pr.id.split('-')[1]}</span>
                    <span>{pr.status === "open" ? "opened" : "merged"} {new Date(pr.createdAt).toLocaleDateString()} by <span className="text-foreground/80 hover:text-blue-400 cursor-pointer">{pr.author}</span></span>
                    <span className="flex items-center gap-1.5">
                      in <span className="text-foreground/80 font-medium hover:underline cursor-pointer">{pr.repoName}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                        <GitBranch className="w-3 h-3" />
                        {pr.headBranch}
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                      <div className="flex items-center gap-1 text-[10px] text-foreground/70 font-mono">
                        <GitBranch className="w-3 h-3" />
                        {pr.baseBranch}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {pr.checksStatus === "passing" && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>All checks passed</span>
                        </div>
                      )}
                      {pr.checksStatus === "failing" && (
                        <div className="flex items-center gap-1.5 text-[11px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Checks failed</span>
                        </div>
                      )}
                      {pr.checksStatus === "pending" && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Checks running</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredPRs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <GitPullRequest className="w-12 h-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No pull requests found</h3>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
