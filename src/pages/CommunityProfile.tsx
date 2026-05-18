import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, MapPin, Link as LinkIcon, Calendar, Github, 
  Twitter, Linkedin, Mail, Share2, Users, FolderGit2, 
  Settings, MoreVertical, ExternalLink, Code2, Star, 
  Zap, ArrowLeft, Copy, Check, Shield, Award, 
  Activity, LayoutGrid, Box, Sparkles, Edit3
} from "lucide-react";
import { useStore, User } from "@/store/useStore";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import ContributionGraph from "@/features/community/components/contribution-graph";
import { SafeIcon } from "@/components/ui/safe-icon";
import { ProfileEditModal } from "@/features/community/components/ProfileEditModal";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

export default function CommunityProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { 
    users, posts, currentUser, followUser, unfollowUser, 
    triggerAI, togglePinProject 
  } = useStore();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'activity'>('overview');

  const profile = useMemo(() => {
    return users.find(u => u.username === username) || (currentUser?.username === username ? currentUser : null);
  }, [users, currentUser, username]);

  const profilePosts = useMemo(() => {
    if (!profile) return [];
    return posts.filter(p => p.userId === profile.id);
  }, [posts, profile]);

  const pinnedProjects = useMemo(() => {
    if (!profile?.pinnedProjects) return [];
    return posts.filter(p => profile.pinnedProjects?.includes(p.id));
  }, [posts, profile]);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <h2 className="text-2xl font-black mb-4">Engineer Not Found</h2>
        <Link to="/community" className="text-primary hover:underline">Back to Community</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const isFollowing = currentUser?.following > 0 && profile.followers > 0; // Simplified for mock

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(profile.id);
      toast.success(`Unfollowed ${profile.username}`);
    } else {
      followUser(profile.id);
      toast.success(`Following ${profile.username}`);
    }
  };

  const handleAISummarize = () => {
    triggerAI(`Please summarize this engineer's profile for a portfolio review. Name: ${profile.username}, Bio: ${profile.bio}, Skills: ${profile.skills?.map(s => s.name).join(', ')}`);
    toast.info("Proto AI is reviewing the portfolio...");
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Portfolio Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20" />
        {profile.banner ? (
          <img src={profile.banner} className="w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        )}
        
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button onClick={() => toast.info("Profile shared!")} className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-black/60 transition-all shadow-2xl">
            <Share2 size={18} />
          </button>
          {isOwnProfile && (
            <button onClick={() => setShowEditModal(true)} className="px-6 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-24 pb-20">
          
          {/* Left Sidebar: Profile Identity */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-48 h-48 rounded-[3rem] bg-card border-8 border-background overflow-hidden shadow-2xl group"
              >
                {profile.avatar ? (
                  <img src={profile.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={profile.username} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-6xl font-black text-white">
                    {profile.username.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </motion.div>
              {profile.badges?.includes('Master Engineer') && (
                <div className="absolute bottom-4 right-4 p-2 bg-yellow-400 rounded-2xl shadow-xl border-4 border-background text-black" title="Master Engineer">
                  <ShieldCheck size={24} />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-foreground mb-1">{profile.username}</h1>
                <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Hardware Systems Engineer</p>
              </div>

              <p className="text-[14px] text-muted-foreground leading-relaxed font-medium">
                {profile.bio || "This engineer hasn't written their mission statement yet. Building the future one circuit at a time."}
              </p>

              {!isOwnProfile && (
                <button 
                  onClick={handleFollowToggle}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isFollowing ? 'bg-secondary text-foreground border border-border/50' : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02]'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow Engineer'}
                  <Zap size={16} fill={isFollowing ? 'none' : 'currentColor'} />
                </button>
              )}

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50 text-center">
                <div>
                  <p className="text-xl font-black text-foreground">{profile.followers}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{profile.following}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Following</p>
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{profilePosts.length}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Projects</p>
                </div>
              </div>

              {/* Engineering Skills */}
              <div className="pt-6 border-t border-border/50 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Cpu size={12} /> Tech Stack & Skills
                </h3>
                <div className="space-y-4">
                  {(profile.skills || [
                    { name: 'Arduino', level: 90 },
                    { name: 'ESP32', level: 85 },
                    { name: 'PCB Design', level: 80 },
                    { name: 'IoT Architecture', level: 75 }
                  ]).map(skill => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                        <span>{skill.name}</span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="pt-6 border-t border-border/50 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Award size={12} /> Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.badges?.map(badge => (
                    <div key={badge} className="px-3 py-1.5 bg-card border border-border/50 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground hover:border-primary transition-colors cursor-default">
                      <SafeIcon icon={Award} size={12} className="text-primary" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Portfolio Showcase */}
          <div className="lg:col-span-8 space-y-12">
            {/* Proto AI Profile Section */}
            <div className="p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <SafeIcon icon={Sparkles} size={48} className="text-primary" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <SafeIcon icon={Sparkles} size={14} /> Proto AI Profile Assistant
                </h3>
                <p className="text-[14px] text-muted-foreground font-medium mb-6 max-w-lg leading-relaxed">
                  Analyze this engineer's performance and contributions. Get a professional summary or recommendations for skill growth.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleAISummarize} className="px-6 py-2.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Summarize Profile
                  </button>
                  <button onClick={() => triggerAI("Suggest 3 new engineering skills I should learn based on my current portfolio.")} className="px-6 py-2.5 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all shadow-lg">
                    Growth Roadmap
                  </button>
                </div>
              </div>
            </div>

            {/* Contribution Activity */}
            <section className="space-y-6">
              <h3 className="text-lg font-black tracking-tighter flex items-center gap-3">
                <Activity className="text-primary" size={24} />
                Engineering Activity
              </h3>
              <ContributionGraph data={[]} />
            </section>

            {/* Featured Projects Grid */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tighter flex items-center gap-3">
                  <Star className="text-yellow-400" size={24} />
                  Featured Portfolios
                </h3>
                <Link to="/repositories" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Projects</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(pinnedProjects.length > 0 ? pinnedProjects : profilePosts.slice(0, 4)).map(p => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>

            {/* Portfolio Categories */}
            <section className="space-y-6">
              <h3 className="text-lg font-black tracking-tighter flex items-center gap-3">
                <LayoutGrid className="text-primary" size={24} />
                Specializations
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Simulations', count: profilePosts.filter(p => p.type === 'Simulation').length, icon: Zap },
                  { name: 'Codebases', count: profilePosts.filter(p => p.type === 'Code').length, icon: Code2 },
                  { name: 'PCB Layouts', count: profilePosts.filter(p => p.type === 'PCB Design').length, icon: Box },
                  { name: 'IoT Systems', count: 0, icon: Cpu }
                ].map(spec => (
                  <div key={spec.name} className="p-6 bg-card border border-border/50 rounded-3xl hover:border-primary transition-all text-center group cursor-pointer">
                    <spec.icon className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                    <p className="text-xl font-black text-foreground">{spec.count}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{spec.name}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <ProfileEditModal 
            isOpen={showEditModal} 
            onClose={() => setShowEditModal(false)} 
            user={profile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for ShieldCheck missing from lucide-react imports in some versions
function ShieldCheck({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
