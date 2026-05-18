import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Star, Share2, Clock, Cpu, Tag, Eye, 
  Heart, GitFork, User, Calendar, Box, Code, 
  Layers, Info, Shield, MessageSquare, ChevronLeft,
  Sparkles, Zap
} from 'lucide-react';
import { useStore, Post } from '@/store/useStore';
import { SafeIcon } from '@/components/ui/safe-icon';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Navbar } from '@/components/layout/Navbar';

export default function ProjectViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    posts, users, loadProject, incrementViews, 
    currentUser, toggleStarProject, triggerAI 
  } = useStore();
  
  const [project, setProject] = useState<Post | null>(null);
  const [creator, setCreator] = useState<any>(null);

  useEffect(() => {
    const foundProject = posts.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      const foundCreator = users.find(u => u.id === foundProject.userId);
      setCreator(foundCreator);
      incrementViews(foundProject.id);
    } else {
      toast.error("Project not found");
      navigate('/community');
    }
  }, [id, posts, users, navigate, incrementViews]);

  if (!project) return null;

  const isStarred = project.starredBy?.includes(currentUser?.id || '');

  const handleOpenInEditor = () => {
    loadProject(project.type, project.data, project.id);
    let targetMode = "sim";
    if (project.type === "Code") targetMode = "code";
    if (project.type === "PCB Design") targetMode = "pcb";
    navigate("/", { state: { targetMode } });
    toast.success(`Opening ${project.title} in editor...`);
  };

  const handleSummarize = () => {
    triggerAI(`Please summarize this project for me. It's a ${project.type} project titled "${project.title}". Metadata: ${JSON.stringify(project.tags)}`);
    toast.info("Proto AI is analyzing the project...");
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <SafeIcon icon={ChevronLeft} size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Community</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Project Hero / Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-secondary/30 group"
            >
              <img 
                src={project.preview || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=60'} 
                alt={project.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {project.type}
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                      {project.visibility}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                    {project.title}
                  </h1>
                </div>

                <button 
                  onClick={handleOpenInEditor}
                  className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group/btn"
                >
                  <SafeIcon icon={Play} size={28} fill="currentColor" className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Project Description & Details */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Info size={14} /> Description
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description || `An advanced engineering project showcasing the power of ProtoLab. This ${project.type} implementation leverages modular components to achieve ${project.complexity} level performance and reliability. Featuring custom logic and optimized resource management.`}
                </p>
              </section>

              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 bg-card/40 rounded-2xl border border-border/50 text-center">
                  <SafeIcon icon={Eye} size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-xl font-black text-foreground">{project.views}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Views</p>
                </div>
                <div className="p-6 bg-card/40 rounded-2xl border border-border/50 text-center">
                  <SafeIcon icon={Heart} size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-xl font-black text-foreground">{project.likes}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Likes</p>
                </div>
                <div className="p-6 bg-card/40 rounded-2xl border border-border/50 text-center">
                  <SafeIcon icon={GitFork} size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-xl font-black text-foreground">{project.forks}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Forks</p>
                </div>
                <div className="p-6 bg-card/40 rounded-2xl border border-border/50 text-center">
                  <SafeIcon icon={Star} size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-xl font-black text-foreground">{project.starredBy?.length || 0}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stars</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Box size={14} /> Components Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.componentsUsed.length > 0 ? project.componentsUsed.map(comp => (
                    <div key={comp} className="px-4 py-2 bg-secondary/50 rounded-xl border border-border/50 flex items-center gap-2 text-sm font-bold text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {comp}
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground italic">No specialized components recorded for this project.</p>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-8">
            {/* Creator Card */}
            <div className="p-8 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Created By</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  {creator?.username?.substring(0, 2).toUpperCase() || 'PL'}
                </div>
                <div>
                  <h4 className="text-xl font-black text-foreground">{creator?.username || 'ProtoLab User'}</h4>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Engineer</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/profile/${creator?.username}`)}
                className="w-full py-3 bg-secondary hover:bg-secondary/80 text-foreground text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-border/50"
              >
                View Profile
              </button>
            </div>

            {/* Metadata Card */}
            <div className="p-8 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Metadata</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Created</span>
                  </div>
                  <span className="text-[11px] font-black text-foreground">{format(new Date(project.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Type</span>
                  </div>
                  <span className="text-[11px] font-black text-foreground">{project.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Complexity</span>
                  </div>
                  <span className="text-[11px] font-black text-primary">{project.complexity}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg border border-primary/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proto AI Actions */}
            <div className="p-8 bg-gradient-to-br from-primary/10 to-cyan-500/10 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-xl space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <SafeIcon icon={Sparkles} size={40} className="text-primary" />
              </div>
              
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
                  <SafeIcon icon={Sparkles} size={12} /> Proto AI Integration
                </h3>
                <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">
                  Let Proto AI analyze this project and suggest improvements or compatible modules.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleSummarize}
                  className="w-full py-3 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <SafeIcon icon={Zap} size={14} />
                  Summarize Project
                </button>
                <button 
                  onClick={() => triggerAI(`What compatible modules or components would work well with this project? Title: ${project.title}, Components: ${project.componentsUsed.join(', ')}`)}
                  className="w-full py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Recommend Modules
                </button>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => toggleStarProject(project.id)}
                className={`flex-1 py-4 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest ${
                  isStarred ? 'bg-yellow-400 border-yellow-500 text-black' : 'bg-card border-border text-foreground hover:border-primary'
                }`}
              >
                <SafeIcon icon={Star} size={18} fill={isStarred ? 'currentColor' : 'none'} />
                {isStarred ? 'Starred' : 'Star Project'}
              </button>
              <button className="flex-1 py-4 bg-card border border-border rounded-2xl hover:border-primary transition-all flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest text-foreground">
                <SafeIcon icon={Share2} size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
