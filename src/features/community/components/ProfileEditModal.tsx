import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Camera, Github, Linkedin, Twitter, Globe, Info, Zap } from 'lucide-react';
import { useStore, User } from '@/store/useStore';
import { SafeIcon } from '@/components/ui/safe-icon';
import { toast } from 'sonner';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, user }) => {
  const { updateProfile, triggerAI } = useStore();
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio || '',
    socialLinks: user.socialLinks || { github: '', twitter: '', linkedin: '', website: '' },
    avatar: user.avatar || '',
    banner: user.banner || ''
  });

  const handleSave = () => {
    updateProfile(formData);
    toast.success("Engineering portfolio updated successfully!");
    onClose();
  };

  const generateAIBio = () => {
    triggerAI("Generate a professional 2-sentence engineering bio for me. I specialize in Embedded Systems and PCB Design.");
    toast.info("Proto AI is drafting your bio...");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-secondary/20">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">Edit Portfolio</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Customize your engineering presence</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {/* Visual Assets */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Camera size={12} /> Visual Assets
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Avatar URL</label>
                <input 
                  type="text" 
                  value={formData.avatar}
                  onChange={e => setFormData({...formData, avatar: e.target.value})}
                  className="w-full h-11 bg-secondary/50 border border-border/50 rounded-xl px-4 text-sm focus:border-primary outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Banner URL</label>
                <input 
                  type="text" 
                  value={formData.banner}
                  onChange={e => setFormData({...formData, banner: e.target.value})}
                  className="w-full h-11 bg-secondary/50 border border-border/50 rounded-xl px-4 text-sm focus:border-primary outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Info size={12} /> Engineering Bio
                </h3>
                <button 
                  onClick={generateAIBio}
                  className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline"
                >
                  <SafeIcon icon={Zap} size={10} fill="currentColor" />
                  Generate with AI
                </button>
             </div>
             <textarea 
               value={formData.bio}
               onChange={e => setFormData({...formData, bio: e.target.value})}
               className="w-full h-32 bg-secondary/50 border border-border/50 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-all resize-none"
               placeholder="Write about your passion for engineering and innovation..."
             />
          </div>

          {/* Social Connections */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Globe size={12} /> Connect Accounts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={formData.socialLinks.github}
                  onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})}
                  className="w-full h-11 pl-12 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-primary outline-none transition-all"
                  placeholder="GitHub Username"
                />
              </div>
              <div className="relative group">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={formData.socialLinks.linkedin}
                  onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                  className="w-full h-11 pl-12 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-primary outline-none transition-all"
                  placeholder="LinkedIn Profile"
                />
              </div>
              <div className="relative group">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={formData.socialLinks.twitter}
                  onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, twitter: e.target.value}})}
                  className="w-full h-11 pl-12 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-primary outline-none transition-all"
                  placeholder="Twitter / X"
                />
              </div>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={formData.socialLinks.website}
                  onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, website: e.target.value}})}
                  className="w-full h-11 pl-12 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-primary outline-none transition-all"
                  placeholder="Personal Portfolio URL"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-border/50 bg-secondary/20 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-transparent text-muted-foreground text-[11px] font-black uppercase tracking-widest rounded-2xl hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
