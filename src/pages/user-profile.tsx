import { useParams, Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { PostCard } from "@/features/community/components/post-card";
import { ArrowLeft, User as UserIcon, Users, Trophy } from "lucide-react";
import { AuthButtons } from "@/components/auth/auth-modals";

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const { users, posts, followUser, currentUser, awardBadge } = useStore();

  const user = users.find((u) => u.username === username);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-2xl font-bold">User not found</h2>
        <Link to="/" className="text-blue-500 hover:underline">Return to ProtoLab</Link>
      </div>
    );
  }

  const userPosts = posts.filter((p) => p.userId === user.id);
  const totalLikes = userPosts.reduce((acc, p) => acc + p.likes, 0);

  useEffect(() => {
    if (userPosts.length >= 1) awardBadge(user.id, "First Project");
    if (userPosts.length >= 10) awardBadge(user.id, "10 Projects");
    if (totalLikes >= 100) awardBadge(user.id, "100 Likes");
  }, [userPosts.length, totalLikes, awardBadge, user.id]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Labs
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="font-semibold text-sm tracking-tight">ProtoLab Profiles</span>
        </div>
        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-start justify-between bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
              <span className="text-4xl font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{user.username}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary">
                  <Users className="w-4 h-4" /> {user.followers} Followers
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary">
                  <UserIcon className="w-4 h-4" /> {userPosts.length} Projects
                </span>
              </div>
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {user.badges.map(b => (
                    <span key={b} className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 shadow-sm cursor-default" title="Community Achievement">
                       <Trophy className="w-3.5 h-3.5" /> {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {currentUser && currentUser.id !== user.id && (
            <button 
              onClick={() => followUser(user.id)}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Follow User
            </button>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 pb-2 border-b border-border">
            Shared Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userPosts.length === 0 ? (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground bg-secondary/20">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No projects yet</h3>
                <p className="text-sm">This user hasn't shared any projects to the community.</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
