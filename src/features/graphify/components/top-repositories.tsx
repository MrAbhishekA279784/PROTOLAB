import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, GitFork, Eye, ExternalLink } from 'lucide-react';

interface TopRepository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  views: number;
  language: string;
  languageColor: string;
}

interface TopRepositoriesProps {
  repositories: TopRepository[];
  className?: string;
}

export function TopRepositories({ repositories, className }: TopRepositoriesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('space-y-4', className)}
    >
      {repositories.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-card/50 hover:bg-card border border-border/50 transition-all"
        >
          <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground truncate">{repo.name}</h4>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: `${repo.languageColor}20`, color: repo.languageColor }}
              >
                {repo.language}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{repo.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-yellow-400" />
                {repo.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitFork className="w-3 h-3 text-purple-400" />
                {repo.forks.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3 text-blue-400" />
                {repo.views.toLocaleString()}
              </span>
            </div>
          </div>

          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}