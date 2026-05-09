import { useStore, Post, PostType } from "@/store/useStore";
import { PostCard } from "./post-card";
import { Users, LayoutDashboard, Search, Filter, TrendingUp, Heart } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function CommunityFeed({ onViewProject }: { onViewProject?: (post: Post) => void }) {
  const { posts, users, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<PostType | "All">("All");

  // Public posts or current user's private posts
  const visiblePosts = posts.filter(p => p.visibility === 'Public' || p.userId === currentUser?.id);

  // Filter and Search logic
  const filteredPosts = visiblePosts.filter(post => {
    const matchesType = filterType === "All" || post.type === filterType;
    const author = users.find(u => u.id === post.userId)?.username || "";
    const query = searchQuery.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(query) || author.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  // Trending Post Logic (Basic metric: Likes + Views logic, simplified by sorting by likes mostly)
  const trendingPosts = [...visiblePosts].sort((a, b) => (b.likes * 2 + b.views) - (a.likes * 2 + a.views)).slice(0, 3);

  return (
    <div className="h-full bg-background overflow-y-auto w-full flex">
      {/* Main Feed Column */}
      <div className="flex-1 p-6 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Community</h1>
              <p className="text-sm text-muted-foreground">
                Discover, fork, and interact with projects.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input 
                 placeholder="Search by title or author..." 
                 className="pl-9"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <div className="w-full sm:w-48">
               <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2"><Filter className="w-4 h-4"/> <SelectValue /></div>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="All">All Projects</SelectItem>
                     <SelectItem value="Simulation">Simulation</SelectItem>
                     <SelectItem value="Code">Code</SelectItem>
                     <SelectItem value="PCB Design">PCB Design</SelectItem>
                  </SelectContent>
               </Select>
             </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl bg-secondary/20">
              <LayoutDashboard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Try adjusting your search or filters!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onViewProject={onViewProject} />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar: Trending */}
      <div className="hidden lg:block w-80 border-l border-border bg-card/30 p-6 overflow-y-auto">
         <h2 className="font-bold flex items-center gap-2 mb-4 text-sm tracking-wide text-muted-foreground uppercase">
           <TrendingUp className="w-4 h-4" /> Trending Projects
         </h2>
         <div className="space-y-4">
            {trendingPosts.length > 0 ? trendingPosts.map(post => (
               <div key={post.id} className="p-3 bg-white border border-border rounded-lg shadow-sm cursor-pointer hover:border-primary transition-all" onClick={() => onViewProject && onViewProject(post)}>
                  <h4 className="font-medium text-sm leading-tight mb-1">{post.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{users.find(u => u.id === post.userId)?.username}</span>
                    <span className="flex items-center gap-1 text-red-500 font-medium"><Heart className="w-3 h-3 fill-current"/> {post.likes}</span>
                  </div>
               </div>
            )) : (
              <div className="text-xs text-muted-foreground text-center py-4">Not enough data to trend</div>
            )}
         </div>
      </div>
    </div>
  );
}
