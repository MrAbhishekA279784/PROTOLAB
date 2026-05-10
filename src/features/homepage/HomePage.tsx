import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Code2, Bot, ShoppingBag, CircuitBoard } from 'lucide-react';
import { SafeIcon } from '@/components/ui/safe-icon';

const FEATURES = [
  {
    icon: Cpu,
    title: 'Circuit Simulation',
    description: 'Place components on a grid canvas, wire them together, and run real-time simulation with instant visual feedback.',
  },
  {
    icon: CircuitBoard,
    title: 'PCB Design',
    description: 'Design board layouts with layer management, netlist tracking, and Gerber export — all in-browser.',
  },
  {
    icon: Code2,
    title: 'Code Lab',
    description: 'Write Arduino and embedded C++ with a Monaco-powered IDE, file explorer, and live compilation output.',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Get intelligent help with circuit debugging, code explanation, and project suggestions — context-aware.',
  },
  {
    icon: ShoppingBag,
    title: 'Component Store',
    description: 'Browse verified microcontrollers, sensors, and kits. Add them directly to your simulation workspace.',
  },
  {
    icon: Zap,
    title: 'Live Simulation',
    description: 'Watch LEDs light up, read sensor values, and see real-time signal propagation across your circuit.',
  },
];

const STEPS = [
  { step: '01', title: 'Design Your Circuit', description: 'Drag components onto the canvas and wire them together with click-to-connect.' },
  { step: '02', title: 'Write Your Code', description: 'Use the integrated code editor to write firmware for Arduino, ESP32, and more.' },
  { step: '03', title: 'Simulate & Iterate', description: 'Run the simulation, get instant feedback, and iterate until your design works.' },
];

interface HomePageProps {
  onNavigate?: (mode: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex flex-col overflow-y-auto h-full">

      {/* Hero Section */}
      <section className="relative py-24 px-6 flex items-center justify-center bg-gradient-to-b from-background to-secondary/30">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[12px] font-semibold">
            <SafeIcon icon={Zap} size={13} /> Open Source Engineering Platform
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-foreground leading-[1.15] mb-5">
            Build, Simulate & Code{' '}
            <span className="text-primary">Electronics</span>
            {' '}— All in One Place
          </h1>

          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
            Design circuits, run simulations, write Arduino code, and get AI help — directly in your browser. No downloads required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate?.('sim')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-[14px] transition-all shadow-sm hover:shadow-md"
            >
              Start Building <SafeIcon icon={ArrowRight} size={16} />
            </button>
            <button
              onClick={() => onNavigate?.('sim')}
              className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border hover:border-border/80 text-foreground rounded-lg font-semibold text-[14px] transition-all hover:bg-secondary shadow-sm"
            >
              Explore Simulation
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[-0.01em] mb-3">Everything You Need to Prototype</h2>
            <p className="text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">A complete browser-based engineering toolkit — from schematic to simulation to firmware.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-border/80 hover:-translate-y-0.5 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3.5">
                    <SafeIcon icon={Icon} size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-background border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[-0.01em] mb-3">How It Works</h2>
            <p className="text-[15px] text-muted-foreground max-w-md mx-auto">Three steps from idea to working prototype.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.step} className="relative text-center">
                <div className="text-5xl font-black text-muted/20 mb-3">{s.step}</div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary/30 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to Build?</h2>
        <p className="text-[15px] text-muted-foreground mb-8 max-w-md mx-auto">Join thousands of engineering students and makers prototyping on ProtoLab.</p>
        <button
          onClick={() => onNavigate?.('sim')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-[14px] transition-all shadow-sm hover:shadow-md"
        >
          Get Started — Free <SafeIcon icon={ArrowRight} size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-[15px] font-semibold text-foreground mb-2">ProtoLab</div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">The complete electronics engineering platform for students and makers.</p>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-foreground mb-3 uppercase tracking-[0.05em]">Platform</h4>
              <div className="flex flex-col gap-2 text-[13px] text-muted-foreground">
                <button onClick={() => onNavigate?.('sim')} className="text-left hover:text-foreground transition-colors">Simulation Lab</button>
                <button onClick={() => onNavigate?.('pcb')} className="text-left hover:text-foreground transition-colors">PCB Design</button>
                <button onClick={() => onNavigate?.('code')} className="text-left hover:text-foreground transition-colors">Code Lab</button>
                <button onClick={() => onNavigate?.('store')} className="text-left hover:text-foreground transition-colors">Store</button>
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-foreground mb-3 uppercase tracking-[0.05em]">Company</h4>
              <div className="flex flex-col gap-2 text-[13px] text-muted-foreground">
                <span className="hover:text-foreground transition-colors cursor-pointer">About</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-foreground mb-3 uppercase tracking-[0.05em]">Legal</h4>
              <div className="flex flex-col gap-2 text-[13px] text-muted-foreground">
                <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-[12px] text-muted-foreground">
            &copy; {new Date().getFullYear()} ProtoLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
