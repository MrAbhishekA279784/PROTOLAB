<div align="center">

# ⚡ ProtoLab

**The browser-native electronics engineering platform.**  
Design circuits. Simulate behavior. Layout PCBs. Write firmware. All in one place.

[![Status](https://img.shields.io/badge/status-beta-orange?style=flat-square)](https://github.com/MrAbhishekA279784/PROTOLAB)
[![License](https://img.shields.io/badge/license-educational-blue?style=flat-square)](#license)
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20TypeScript-61DAFB?style=flat-square)](#tech-stack)
[![Monaco](https://img.shields.io/badge/editor-Monaco-007ACC?style=flat-square)](#protocode-studio)

</div>

---

## What is ProtoLab?

Electronics development is fragmented. You open one tool for simulation, another for PCB layout, another for firmware, and yet another for component sourcing — constantly switching context, losing flow.

**ProtoLab fixes this.**

It's a unified, browser-based engineering workspace where hardware and software development coexist in a single platform — no installations, no switching, no friction.

Inspired by the best: VS Code's editor experience, Figma's clean UI, Arduino IDE's simplicity, and EasyEDA's browser-first approach.

---

## Modules

### 🏠 Home
The central hub of the ProtoLab ecosystem. Clean, responsive landing experience with unified navigation, dark/light mode, and a full overview of every engineering tool available.

---

### 🛒 Component Store
A browser-integrated electronics marketplace. Browse microcontrollers, sensors, displays, actuators, and passive components — then drop them directly into your simulation. No tab switching.

---

### 🔬 Simulation Lab
The interactive circuit prototyping workspace.

- Drag-and-drop component placement
- Wire components on a live canvas
- Zoom, snap, and organize layouts
- Supports: Resistors, Capacitors, LEDs, Buttons, Batteries, Breadboards, Arduino boards, Motors, Sensors

> **Roadmap:** Real-time electrical validation, current visualization, waveform analysis, digital logic simulation.

---

### 🖥️ PCB Lab
Professional PCB design in the browser.

- Multi-layer canvas (Top/Bottom Copper, Silk, Solder Mask, Drill)
- Trace routing and layer management
- Design rule inspector
- EDA-style interface with file/project explorer

> **Roadmap:** Gerber export, auto-routing, footprint libraries, schematic linking, DRC/ERC.

---

### 💻 ProtoCode Studio
Embedded programming environment built for Arduino workflows.

- **Monaco Editor** — the same engine that powers VS Code
- Syntax highlighting for embedded C/C++
- Sketchbook explorer and tabbed editing
- Serial monitor panel and terminal output
- Examples section

> **Roadmap:** Cloud compilation engine, hardware linking, AI code suggestions, debugging tools, cloud saves.

---

### 👥 Community
Engineering collaboration hub. Discover projects, browse trending builds, and share your work.

> **Roadmap:** Public projects, fork system, comments, likes, team collaboration, shared simulations.

---

### 🤖 AI Assistant
Integrated AI engineering assistant for circuit understanding, firmware help, debugging guidance, and component recommendations.

> **Roadmap:** AI circuit generation, PCB optimization, simulation suggestions, electronics tutor.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand |
| Editor | Monaco Editor |
| UI Primitives | shadcn/ui + Lucide React |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/MrAbhishekA279784/PROTOLAB.git

# Enter the project
cd PROTOLAB

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── features/
│   ├── simulation/       # Circuit simulation workspace
│   ├── pcb/              # PCB design lab
│   ├── protocode-studio/ # Embedded code editor
│   ├── store/            # Component marketplace
│   ├── community/        # Collaboration hub
│   └── ai/               # AI assistant
├── components/           # Shared UI primitives
├── hooks/                # Custom React hooks
├── stores/               # Zustand state management
├── lib/                  # Utilities and helpers
└── types/                # TypeScript definitions
```

Feature-driven architecture. Every module is self-contained, independently scalable, and easy to extend.

---

## Design Philosophy

ProtoLab follows a minimal, engineering-focused design language.

- **Productivity-first** — no visual noise, every element earns its place
- **Dark/light parity** — both modes are first-class citizens
- **Consistent panels** — unified layout system across every module
- **Subtle motion** — Framer Motion animations that enhance, never distract

Inspired by Linear, Vercel, GitHub, VS Code, and Stripe.

---

## Roadmap

- [ ] Real-time simulation engine
- [ ] AI-assisted circuit generation
- [ ] Cloud project saves + authentication
- [ ] Collaborative multiplayer editing
- [ ] PCB Gerber export pipeline
- [ ] Integrated firmware flashing
- [ ] Waveform analysis
- [ ] IoT integrations
- [ ] Version control for circuits
- [ ] Simulation playback

---

## Author

**Abhishek Gupta**  
Mechatronics Engineering Student  
Focused on Robotics · Embedded Systems · Electronics · AI · Full Stack Development

---

## License

This project is intended for educational, research, and prototyping purposes.

---

<div align="center">

**ProtoLab** — Hardware and software development, finally in one place.

</div>
