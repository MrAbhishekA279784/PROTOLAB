import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Rocket, Zap, BookOpen, Code2, Sparkles, 
  ChevronRight, ArrowRight, Check, Bot, Layout,
  Layers, Settings, CircuitBoard, Brain
} from 'lucide-react';
import { SafeIcon } from '@/components/ui/safe-icon';

const skillLevels = [
  { id: 'beginner', title: 'Beginner', desc: 'New to electronics & code', icon: BookOpen },
  { id: 'intermediate', title: 'Intermediate', desc: 'Built some projects before', icon: Rocket },
  { id: 'advanced', title: 'Advanced', desc: 'Experienced engineer', icon: Zap },
];

const interestOptions = [
  { id: 'arduino', label: 'Arduino', icon: Cpu },
  { id: 'esp32', label: 'ESP32 / IoT', icon: CircuitBoard },
  { id: 'robotics', label: 'Robotics', icon: Settings },
  { id: 'pcb', label: 'PCB Design', icon: Layers },
  { id: 'ai', label: 'AI & ML', icon: Brain },
  { id: 'automation', label: 'Automation', icon: Layout },
];

const templates = [
  { id: 'blink', title: 'Smart LED Controller', desc: 'Perfect first project', tag: 'Beginner' },
  { id: 'weather', title: 'IoT Weather Station', desc: 'ESP32 + Sensors', tag: 'Intermediate' },
  { id: 'drone', title: 'Drone ESC', desc: 'Power electronics', tag: 'Advanced' },
];

export function OnboardingTour() {
  const { hasSeenTour, setHasSeenTour, triggerAI, updateProfile } = useStore();
  const [step, setStep] = useState(0);
  
  // Form State
  const [skill, setSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  if (hasSeenTour) return null;

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    // Optionally update profile with skills/interests here if backend supported it
    // updateProfile({ bio: `Level: ${skill}, Interests: ${interests.join(', ')}` });
    setHasSeenTour(true);
    triggerAI("Welcome to ProtoLab! I've configured your workspace based on your preferences. Let me know what you'd like to build first!");
  };

  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const variants = {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.3 } }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Dynamic Background Blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
      />
      
      {/* Onboarding Container */}
      <div className="relative w-full max-w-3xl aspect-[16/10] max-h-[80vh] flex overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 shadow-2xl shadow-primary/10">
        
        {/* Left Progress Panel */}
        <div className="w-64 bg-secondary/30 p-8 hidden md:flex flex-col border-r border-border/50">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-black tracking-tighter text-lg">ProtoLab</span>
          </div>

          <div className="flex-1 space-y-8 relative">
            <div className="absolute left-3 top-2 bottom-6 w-px bg-border/50" />
            
            {['Welcome', 'Interests', 'Proto AI', 'Quick Start'].map((label, idx) => (
              <div key={label} className="flex items-center gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                  step > idx ? 'bg-primary text-white' : 
                  step === idx ? 'bg-primary text-white shadow-[0_0_15px_rgba(79,107,255,0.5)]' : 
                  'bg-secondary text-muted-foreground border border-border'
                }`}>
                  {step > idx ? <Check size={12} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  step === idx ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-background/50 to-secondary/20">
          <AnimatePresence mode="wait">
            {/* STEP 0: Welcome & Skill */}
            {step === 0 && (
              <motion.div key="step-0" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 p-10 flex flex-col justify-center h-full">
                <div className="max-w-md mx-auto w-full">
                  <h2 className="text-3xl font-black tracking-tighter mb-2">Welcome to your lab.</h2>
                  <p className="text-muted-foreground mb-10">Let's personalize your engineering experience. What's your current experience level?</p>
                  
                  <div className="space-y-3">
                    {skillLevels.map(lvl => (
                      <button
                        key={lvl.id}
                        onClick={() => { setSkill(lvl.id); setTimeout(handleNext, 300); }}
                        className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group ${
                          skill === lvl.id 
                            ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                            : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/50 text-foreground'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          skill === lvl.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground group-hover:text-primary'
                        }`}>
                          <lvl.icon size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{lvl.title}</h4>
                          <p className="text-xs text-muted-foreground">{lvl.desc}</p>
                        </div>
                        <ChevronRight className={`ml-auto transition-transform ${skill === lvl.id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}`} size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1: Interests */}
            {step === 1 && (
              <motion.div key="step-1" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 p-10 flex flex-col justify-center h-full">
                <div className="max-w-md mx-auto w-full">
                  <h2 className="text-3xl font-black tracking-tighter mb-2">What are you building?</h2>
                  <p className="text-muted-foreground mb-10">Select your focus areas to get tailored templates and components.</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => toggleInterest(opt.id)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 group ${
                          interests.includes(opt.id)
                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(79,107,255,0.15)]' 
                            : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <opt.icon size={20} className={interests.includes(opt.id) ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                        <span className="font-bold text-sm text-left">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Proto AI */}
            {step === 2 && (
              <motion.div key="step-2" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 p-10 flex flex-col justify-center h-full">
                <div className="max-w-md mx-auto w-full text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 p-1 mb-8 shadow-2xl shadow-primary/30 relative">
                    <div className="absolute inset-0 bg-primary blur-xl opacity-50 animate-pulse" />
                    <div className="w-full h-full bg-card rounded-full flex items-center justify-center relative z-10">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter mb-4">Meet Proto AI</h2>
                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                    Your personal engineering copilot. Proto AI can generate boilerplate code, suggest circuit optimizations, explain complex concepts, and debug your projects in real-time.
                  </p>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs font-bold text-primary flex items-center justify-center gap-2">
                    <Bot size={14} /> AI features are active and configured for {skill || 'your level'}.
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Quick Start */}
            {step === 3 && (
              <motion.div key="step-3" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 p-10 flex flex-col justify-center h-full">
                <div className="max-w-md mx-auto w-full">
                  <h2 className="text-3xl font-black tracking-tighter mb-2">Ready to launch.</h2>
                  <p className="text-muted-foreground mb-10">Start with a template or jump into an empty workspace.</p>
                  
                  <div className="space-y-3 mb-6">
                    {templates.map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                          selectedTemplate === tpl.id 
                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' 
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <div>
                          <h4 className={`font-bold text-sm ${selectedTemplate === tpl.id ? 'text-primary' : 'text-foreground'}`}>{tpl.title}</h4>
                          <p className="text-xs text-muted-foreground">{tpl.desc}</p>
                        </div>
                        <span className="px-2 py-1 rounded border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {tpl.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedTemplate('blank')}
                    className="w-full text-center py-3 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                  >
                    Or start from scratch
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-border/50 bg-card/40 flex items-center justify-between mt-auto z-10">
            <div className="flex gap-1.5 md:hidden">
              {[0,1,2,3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-secondary'}`} />
              ))}
            </div>
            
            <div className="ml-auto flex gap-3">
              {step > 0 && (
                <button 
                  onClick={() => setStep(s => s - 1)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                disabled={step === 0 && !skill}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-primary/20"
              >
                {step === 3 ? 'Launch Workspace' : 'Continue'}
                {step === 3 ? <Rocket size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
