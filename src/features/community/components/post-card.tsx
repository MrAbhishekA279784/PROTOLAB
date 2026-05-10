import { useStore, Post } from "@/store/useStore";
import { formatDistanceToNow } from "date-fns";
import {
  Heart, MessageSquare, Share2, Eye, Code2, CircuitBoard, Cpu,
  GitFork, Layers, Tag, ChevronDown, ChevronUp, Reply, Clock, History, BarChart2, ThumbsUp, Send, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const getTypeIcon = (type: Post["type"]) => {
  switch (type) {
    case "Simulation": return <Cpu className="w-5 h-5 text-blue-500" />;
    case "Code": return <Code2 className="w-5 h-5 text-green-500" />;
    case "PCB Design": return <CircuitBoard className="w-5 h-5 text-purple-500" />;
    default: return null;
  }
};

export function PostCard({ post, onViewProject }: { post: Post, onViewProject?: (post: Post) => void }) {
  const { currentUser, users, likePost, forkProject, addComment, incrementViews, upvoteComment } = useStore();
  const navigate = useNavigate();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const postAuthor = users.find((u) => u.id === post.userId);
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

  const handleLike = () => {
    if (!currentUser) return toast.error("Please login to like posts");
    likePost(post.id);
  };

  const handleFork = () => {
    if (!currentUser) return toast.error("Please login to fork projects");
    const newId = forkProject(post.id);
    if (newId) {
      toast.success("Project forked to your workspace!");
      const { posts } = useStore.getState();
      const newPost = posts.find(p => p.id === newId);
      if (newPost && onViewProject) {
        onViewProject(newPost);
      }
    }
  };

  const handlePostComment = () => {
    if (!currentUser) return toast.error("Please login to comment");
    if (!commentText.trim()) return;
    addComment(post.id, commentText, replyToId || undefined);
    setCommentText("");
    setReplyToId(null);
  };

  const handleViewProject = () => {
    incrementViews(post.id);
    if(onViewProject) onViewProject(post);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-secondary/80 shrink-0"
              onClick={() => postAuthor && navigate(`/user/${postAuthor.username}`)}
            >
              {postAuthor?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div
                className="font-medium hover:underline cursor-pointer leading-tight"
                onClick={() => postAuthor && navigate(`/user/${postAuthor.username}`)}
              >
                {postAuthor?.username || "Unknown User"}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  {getTypeIcon(post.type)}
                  {post.type}
                </span>
                {post.views > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {post.views}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {onViewProject && (
            <Button variant="outline" size="sm" className="gap-2 h-8" onClick={handleViewProject}>
              <ExternalLink className="w-3.5 h-3.5" /> View
            </Button>
          )}
        </div>
        <h3 className="text-lg font-bold leading-tight mb-2">{post.title}</h3>
                 {/* Post Analytics / Stats */}
                 <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold mb-4 bg-secondary/50 p-2 rounded-lg border border-border">
                    <div className="flex items-center gap-1.5"><BarChart2 className="w-3 h-3 text-primary" /> Analytics Summary:</div>
                    <div className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views || 0} views</div>
                    <div className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {post.forks || 0} forks</div>
                    <div className="flex items-center gap-1"><History className="w-3 h-3" /> {post.versions?.length || 1} versions</div>
                 </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 mb-1">
           {post.complexity && (
             <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-secondary text-muted-foreground uppercase">
               {post.complexity}
             </span>
           )}
           {post.tags?.map(tag => (
             <span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
               #{tag}
             </span>
           ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="w-full border-y border-border relative group flex items-start min-h-[150px] max-h-[300px] overflow-hidden">
        {post.type === "Code" ? (
           <div className="w-full h-full p-4 overflow-hidden bg-secondary flex-1">
              <pre className="text-[10px] sm:text-[11px] text-left text-green-400 font-mono whitespace-pre w-full">
                {(typeof post.data === "string" ? post.data : "").split("\n").slice(0, 15).join("\n") + "\n..."}
              </pre>
           </div>
        ) : post.preview ? (
          <img src={post.preview} alt="Post preview" className="w-full min-h-[150px] max-h-[300px] object-cover bg-secondary" />
        ) : (
          <div className="flex items-center justify-center w-full min-h-[150px] bg-secondary/50">
             {getTypeIcon(post.type)}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-4 py-3 bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-1.5 rounded-full ${isLiked ? "text-destructive hover:text-destructive/90 hover:bg-destructive/10" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            {post.likes > 0 && post.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-1.5 rounded-full text-muted-foreground hover:bg-secondary"
          >
            <MessageSquare className="w-4 h-4" />
            {post.comments?.length > 0 && post.comments.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFork}
            className="gap-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Fork Project"
          >
            <GitFork className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="px-4 py-3 border-t border-border bg-secondary/30 flex flex-col gap-3">
           <div className="flex gap-2">
              <input
                type="text"
                placeholder={replyToId ? "Write a reply..." : "Add a comment..."}
                className="flex-1 text-sm px-3 py-1.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-card transition-shadow text-foreground"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
              />
              <Button size="icon" variant="default" className="h-9 w-9 shrink-0" onClick={handlePostComment}>
                 <Send className="w-4 h-4" />
              </Button>
           </div>

           {post.comments?.length > 0 && (
              <div className="space-y-3 mt-2 max-h-60 overflow-y-auto pr-1">
                {post.comments.map((comment) => {
                  const commentAuthor = users.find(u => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="flex flex-col gap-1.5">
                       <div className="flex items-start gap-2.5">
                           <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 shadow-sm border border-card">
                               <span className="text-[10px] font-bold text-muted-foreground">{commentAuthor?.username.charAt(0).toUpperCase()}</span>
                           </div>
                           <div className="bg-card px-3 py-2 rounded-xl rounded-tl-none border border-border shadow-sm flex-1">
                               <div className="flex justify-between items-baseline mb-0.5">
                                 <span className="font-semibold text-xs text-foreground">{commentAuthor?.username}</span>
                               </div>
                               <p className="text-muted-foreground text-[13px] leading-snug">{comment.text}</p>
                               <div className="flex items-center gap-3 mt-1.5">
                                 <button onClick={() => upvoteComment(post.id, comment.id)} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground hover:text-success transition-colors">
                                    <ThumbsUp className="w-3 h-3" /> {(comment as any).upvotes || 0} Upvotes
                                 </button>
                                 <button onClick={() => setReplyToId(comment.id)} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors">
                                    <Reply className="w-3 h-3" /> Reply
                                 </button>
                              </div>
                           </div>
                       </div>

                       {/* Nested Replies */}
                       {comment.replies?.length > 0 && (
                          <div className="ml-10 space-y-2 mt-1 relative before:content-[''] before:absolute before:-left-3.5 before:top-0 before:w-px before:h-full before:bg-border">
                             {comment.replies.map((reply) => {
                               const replyAuthor = users.find(u => u.id === reply.userId);
                               return (
                                 <div key={reply.id} className="flex items-start gap-2 relative">
                                     <div className="absolute -left-3.5 top-2.5 w-3 h-px bg-border" />
                                     <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-card shadow-sm">
                                         <span className="text-[8px] font-bold text-muted-foreground">{replyAuthor?.username.charAt(0).toUpperCase()}</span>
                                     </div>
                                     <div className="bg-card px-2.5 py-1.5 rounded-lg rounded-tl-none border border-border flex-1 shadow-sm">
                                         <span className="font-semibold text-[11px] block text-foreground mb-0.5">{replyAuthor?.username}</span>
                                         <p className="text-muted-foreground text-xs leading-snug">{reply.text}</p>
                                         <div className="flex items-center gap-3 mt-1.5">
                                            <button onClick={() => upvoteComment(post.id, reply.id)} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground hover:text-success transition-colors">
                                               <ThumbsUp className="w-3 h-3" /> {(reply as any).upvotes || 0} Upvotes
                                            </button>
                                         </div>
                                     </div>
                                 </div>
                               );
                             })}
                          </div>
                       )}
                    </div>
                  );
                })}
              </div>
           )}
        </div>
      )}
    </div>
  );
}
