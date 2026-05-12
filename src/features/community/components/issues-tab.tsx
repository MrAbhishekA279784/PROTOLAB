import { useState } from "react";
import { motion } from "framer-motion";
import {
  CircleDot,
  CheckCircle2,
  MessageSquare,
  Search,
  Filter,
  ArrowUpDown,
  Tag,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_ISSUES } from "../data/mock-data";
import { cn } from "@/lib/utils";

export default function IssuesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const filteredIssues = MOCK_ISSUES.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         issue.repoName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || issue.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center shadow-inner">
              <CircleDot className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Issues</h2>
              <p className="text-[12px] text-muted-foreground">Track bugs and feature requests</p>
            </div>
          </div>
          <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            New Issue
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search all issues..."
              className="pl-9 bg-background/50 border-white/5 focus:border-red-500/50 focus:ring-red-500/20 transition-all h-9 text-sm rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <div className="flex bg-background/50 p-1 rounded-xl border border-white/5">
              {(["all", "open", "closed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all",
                    filter === f 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-background/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/10 transition-all shrink-0">
              <Tag className="w-3.5 h-3.5" />
              Labels
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-4 max-w-5xl mx-auto">
          {filteredIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group p-4 rounded-2xl bg-card/40 border border-white/5 hover:border-red-500/30 hover:bg-card/60 transition-all shadow-sm hover:shadow-md hover:shadow-red-500/5"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  issue.status === "open" ? "bg-red-500/10 text-red-500" : "bg-purple-500/10 text-purple-500"
                )}>
                  {issue.status === "open" ? <CircleDot className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-red-400 transition-colors truncate leading-tight">
                      {issue.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 bg-white/5 px-2 py-0.5 rounded-full">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{issue.comments}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-[12px] text-muted-foreground">
                    <span className="font-medium text-foreground/70">#{issue.id.split('-')[1]}</span>
                    <span>opened {new Date(issue.createdAt).toLocaleDateString()} by <span className="text-foreground/80 hover:text-red-400 cursor-pointer">{issue.author}</span></span>
                    <span className="flex items-center gap-1.5">
                      in <span className="text-foreground/80 font-medium hover:underline cursor-pointer">{issue.repoName}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {issue.labels.map(label => (
                      <span 
                        key={label}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-wider uppercase text-muted-foreground group-hover:border-red-500/20 group-hover:text-foreground transition-all"
                      >
                        {label}
                      </span>
                    ))}
                    {issue.assignee && (
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[11px] text-muted-foreground italic">assigned to</span>
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold border border-white/10">
                          {issue.assignee.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <CircleDot className="w-12 h-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No issues found</h3>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
