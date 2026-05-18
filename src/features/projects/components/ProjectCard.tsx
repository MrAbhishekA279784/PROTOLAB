import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Share2, MoreVertical, Play, 
  Clock, Cpu, Tag, Eye, Heart, GitFork, Trash2, Copy, Edit2 
} from 'lucide-react';
import { Post, useStore } from '@/store/useStore';
import { SafeIcon } from '@/components/ui/safe-icon';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Post;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { toggleStarProject, duplicateProject, deleteProject, renameProject, currentUser } = useStore();
  const isOwner = currentUser?.id === project.userId;
  const isStarred = project.starredBy?.includes(currentUser?.id || '');

  const handleOpen = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10"
    >
      {/* Thumbnail Area */}
      <div className="relative h-44 overflow-hidden bg-secondary/30">
        <img 
          src={project.preview || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60'} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={handleOpen}
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
          >
            <SafeIcon icon={Play} size={20} fill="currentColor" />
          </button>
        </div>

        {/* Visibility Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
          {project.visibility}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 backdrop-blur-md rounded-lg border border-primary/30 text-[9px] font-black uppercase tracking-widest text-primary">
          {project.type}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-black tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleStarProject(project.id)}
              className={`p-1.5 rounded-lg transition-all ${isStarred ? 'text-yellow-400' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <SafeIcon icon={Star} size={16} fill={isStarred ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <p className="text-[12px] text-muted-foreground line-clamp-2 mb-4 h-9 leading-relaxed">
          {project.description || `A advanced ${project.type} project built with ProtoLab components. Perfect for ${project.complexity} level engineering.`}
        </p>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <SafeIcon icon={Clock} size={10} />
              {formatDistanceToNow(new Date(project.createdAt))} ago
            </span>
            <span className="flex items-center gap-1">
              <SafeIcon icon={Eye} size={10} />
              {project.views}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-secondary/50 rounded-md border border-border/50 text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Owner Actions (Visible on Hover if owner) */}
      {isOwner && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => duplicateProject(project.id)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-primary transition-colors" title="Duplicate">
            <SafeIcon icon={Copy} size={12} />
          </button>
          <button onClick={() => deleteProject(project.id)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-red-500 transition-colors" title="Delete">
            <SafeIcon icon={Trash2} size={12} />
          </button>
        </div>
      )}
    </motion.div>
  );
};
