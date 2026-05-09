import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, ChevronRight, Check } from 'lucide-react';

const steps = [
  { title: 'Welcome to ProtoLab', desc: 'Your comprehensive electronics prototyping environment. Let us show you around!' },
  { title: 'Component Store', desc: 'Browse and add realistic components, sensors, and microcontrollers to your inventory.' },
  { title: 'Simulation Lab', desc: 'Wire up your circuits and instantly simulate their electrical behavior in real-time.' },
  { title: 'PCB Design', desc: 'Layout the physical board traces for real-world manufacturing.' },
  { title: 'Code Lab', desc: 'Write Arduino C++ firmware and deploy it directly onto your simulated microcontrollers.' },
  { title: 'Community Feed', desc: 'Share your completed projects, fork others, and learn from the community!' }
];

export function OnboardingTour() {
  const { hasSeenTour, setHasSeenTour } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (hasSeenTour) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else setHasSeenTour(true);
  };

  return (
     <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-300 border border-border">
           <button onClick={() => setHasSeenTour(true)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
           </button>
           
           <div className="mb-6 mt-2">
              <div className="flex items-center gap-2 mb-3">
                 <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold shrink-0">{currentStep + 1}</span>
                 <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{steps[currentStep].desc}</p>
           </div>
           
           {/* Navigation Dots and Button */}
           <div className="flex justify-between items-center mt-8">
              <div className="flex gap-1.5">
                 {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`} />
                 ))}
              </div>
              <button 
                onClick={handleNext} 
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
              >
                 {currentStep === steps.length - 1 ? (
                    <>Get Started <Check className="w-4 h-4" /></>
                 ) : (
                    <>Next <ChevronRight className="w-4 h-4" /></>
                 )}
              </button>
           </div>
        </div>
     </div>
  );
}
