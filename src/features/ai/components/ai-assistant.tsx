import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Send, Bot, Sparkles, X, Lightbulb, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "Generate LED blink with Arduino",
  "Explain this project",
  "How do I connect an LED to Arduino?",
  "Explain H-bridge motor control",
];

function getSmartResponse(input: string): string {
  const q = input.toLowerCase();
  
  if (q.includes("generate") || q.includes("led blink with arduino")) {
    return "[CMD:GENERATE_BLINK]";
  }
  if (q.includes("explain this project") || q.includes("explain")) {
    return "[CMD:EXPLAIN]";
  }

  if (q.includes("led")) {
    return `**LED Wiring Guide:**\n\n• Connect the **longer leg (anode +)** to a digital pin via a resistor\n• Connect the **shorter leg (cathode -)** to GND\n• Use a **220Ω resistor** to limit current for a 5V source\n\n**Formula:** R = (Vcc - Vf) / If\nFor a red LED: R = (5V - 2V) / 20mA = **150Ω** (use 220Ω to be safe)\n\nWould you like me to place this in your simulation?`;
  }
  if (q.includes("resistor")) {
    return `**Resistor Selection:**\n\nUse Ohm's Law: **R = V / I**\n\n| Color Bands | Value |\n|---|---|\n| Brown Black Red | 1kΩ |\n| Red Red Red | 2.2kΩ |\n| Orange Orange Brown | 330Ω |\n\nFor LEDs at 5V, a **220Ω–470Ω** resistor is standard.\n\nNeed help calculating a specific value?`;
  }
  if (q.includes("motor") || q.includes("h-bridge")) {
    return `**H-Bridge Motor Control:**\n\nAn H-Bridge (like L298N) lets you control motor direction:\n\n\`\`\`\nIN1=HIGH, IN2=LOW → Forward\nIN1=LOW, IN2=HIGH → Reverse\nIN1=LOW, IN2=LOW  → Stop\n\`\`\`\n\nConnect **ENA** to a PWM pin for speed control.\n\nWant me to show a full Arduino + L298N wiring diagram?`;
  }
  if (q.includes("arduino")) {
    return `**Arduino Uno Pinout Quick Reference:**\n\n• **Digital Pins 0-13** – GPIO (pins 3,5,6,9,10,11 support PWM ~)\n• **A0-A5** – Analog input (0-1023)\n• **5V / 3.3V / GND** – Power rails\n• **Vin** – External power input (7-12V)\n\nTip: Always use a **current-limiting resistor** on output pins (max 40mA per pin).`;
  }
  if (q.includes("breadboard")) {
    return `**How a Breadboard Works:**\n\n• **Horizontal rows** (a-e and f-j) are internally connected — great for component leads\n• **Vertical rails** (+ and −) run the full length — use for power and GND\n• The **center gap** separates the two halves — perfect for ICs\n\n**Tip:** Always connect power rail to Arduino 5V and GND before placing components.`;
  }
  if (q.includes("capacitor")) {
    return `**Capacitor Basics:**\n\n• **Electrolytic caps** are polarized — longer leg = positive\n• Used for **power filtering**, **decoupling**, and **timing circuits**\n• Common values: 100µF (bulk bypass), 100nF (high-freq decoupling)\n\nAlways place a **100nF cap** near IC power pins to eliminate noise.`;
  }
  return `**Electron AI Response:**\n\nGreat question about: *"${input}"*\n\nHere's what I know:\n\nElectronics design involves careful component selection, proper connections, and understanding of circuit theory. For your specific question, I recommend:\n\n1. Check your component datasheets for voltage/current ratings\n2. Use a multimeter to verify connections\n3. Start with a simulation before building the real circuit\n\nCould you provide more details? I can give a more specific answer about your circuit design.`;
}

const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const { loadProject, loadedProject } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm **Electron AI**. I can explain your electronics projects or even generate circuits for you (e.g. 'Generate LED blink with Arduino'). ⚡",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsLoading(true);

    try {
      // Intercept local smart commands
      const smartRes = getSmartResponse(msg);
      
      if (smartRes === "[CMD:GENERATE_BLINK]") {
        setIsLoading(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "ai", text: "**Circuit Generated!**\n\nI have added an Arduino, an LED, a Resistor, and wired them up.\n\nI've deployed the code and components to your Simulation Lab. Click 'Run' to test it!" }]);
          loadProject("Simulation", {
             components: [
                { id: "ard_ai", type: "arduino", x: 200, y: 150, rotation: 0 },
                { id: "led_ai", type: "led", x: 500, y: 180, rotation: 0 },
                { id: "res_ai", type: "resistor", x: 500, y: 280, rotation: 0 }
             ],
             wires: [
                { id: "w1", startPin: { compId: "ard_ai", pinId: "D13" }, endPin: { compId: "led_ai", pinId: "anode" }, points: [] },
                { id: "w2", startPin: { compId: "led_ai", pinId: "cathode" }, endPin: { compId: "res_ai", pinId: "p1" }, points: [] },
                { id: "w3", startPin: { compId: "res_ai", pinId: "p2" }, endPin: { compId: "ard_ai", pinId: "GND1" }, points: [] }
             ]
          });
          setIsLoading(false);
        }, 1200);
        return;
      }

      if (smartRes === "[CMD:EXPLAIN]") {
         setIsLoading(true);
         setTimeout(() => {
           let explainText = "It looks like you haven't loaded a project yet. Please open a project first!";
           if (loadedProject) {
              if (loadedProject.type === "Simulation") {
                 const compCount = loadedProject.data?.components?.length || 0;
                 explainText = `**Project Analysis (Simulation)**\n\nThis circuit uses **${compCount} components**.\n\n**How it works**:\nThe components are wired together to form a logical electronic flow. The Arduino runs its C++ logic to read peripheral inputs and drive hardware outputs accordingly.\n\n**Real-World Use Cases**:\nPrototyping embedded systems, hardware validation without soldering, and interactive STEM learning.`;
              } else if (loadedProject.type === "Code") {
                 explainText = `**Project Analysis (Code)**\n\nThis is an Arduino firmware written in C++.\n\n**How it works**:\nThe \`setup()\` function configures the hardware pins, while \`loop()\` continuously executes the main control logic to poll sensors and actuate outputs.\n\n**Real-World Use Cases**:\nFlashing logic directly to microcontrollers for robotics, IoT automation, and custom peripherals.`;
              } else if (loadedProject.type === "PCB Design") {
                 explainText = `**Project Analysis (PCB Design)**\n\nThis is a multilayer printed circuit board layout.\n\n**How it works**:\nIt physically routes traces between components on different layers to establish conductivity without messy wires.\n\n**Real-World Use Cases**:\nManufacturing a physical board for production, rigid hardware enclosures, and reliable permanent installations.`;
              }
           }
           setMessages(prev => [...prev, { role: "ai", text: explainText }]);
           setIsLoading(false);
         }, 800);
         return;
      }

      // Default smart fallback (normally we'd hit an API here)
      await new Promise((r) => setTimeout(r, 600)); 
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: getSmartResponse(msg) },
      ]);
    } catch {
      // Error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-card shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out border-l border-border ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border bg-gradient-to-r from-blue-600 to-blue-500 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm leading-none">Electron AI</h2>
              <p className="text-blue-100 text-[11px] mt-0.5">Electronics Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 py-3 border-b border-border bg-secondary/30 shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Quick Questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-background border border-border text-[11px] text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-50 shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md"
                    : "bg-secondary text-foreground border border-border rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                <span className="text-[13px] text-muted-foreground italic">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border shrink-0 bg-card">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about circuits, components..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">Press Enter to send · Shift+Enter for newline</p>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
