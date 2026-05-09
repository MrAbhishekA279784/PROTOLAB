# Product Requirements Document (PRD)

## Product Vision
Enable users to learn, simulate, code, design, and build electronics in one place without wasting physical components.

## Core Features & Requirements

### 1. Electronics E-Commerce
- **Catalog:** Browse individual components (resistors, ICs, sensors) and complete kits (Arduino, IoT, drones).
- **Product Detail Pages (PDP):** Include datasheets, tutorials, and a "Simulate Now" button to load the component in the Lab.
- **Cart & Checkout:** Standard e-commerce flow with Razorpay integration and Shiprocket logistics.

### 2. Simulation Lab
- **Canvas:** Drag-and-drop circuit builder with breadboard-based user interface.
- **Simulation:** Real-time feedback (LED glows, motor spins, signal flow visualization).
- **Kit Auto-load:** One-click load of purchased kits into the simulator.

### 3. Arduino Coding Lab
- **IDE:** Browser-based code editor using Monaco for syntax highlighting and autocompletion.
- **Execution & Serial Monitor:** Compile and run code (WASM/sandbox) against the simulated circuit.
- **Support:** Arduino boards, ESP32, ESP8266, and major libraries.

### 4. Code + Simulation Integration
- **Live Sync:** Code execution must directly assert state changes in the Simulation Lab (e.g., `digitalWrite(LED_BUILTIN, HIGH)` turns the visual LED on).

### 5. AI Assistant (Electron)
- **Core:** Explain components, analyze circuits, provide line-by-line code explanation, debug errors.
- **Advanced:** Image-to-circuit detection, reverse engineering suggestions.

### 6. Smart Cart Simulation
- Ability to take the current state of a shopping cart and instantly generate a simulated workspace containing those exact parts.

### 7. PCB & 3D Modules
- **PCB Design:** Drag-and-drop builder, grid-based routing, multi-layer, Gerber export/import.
- **3D Modeling:** Upload STL/STEP files, WebGL/Three.js preview, 3D printing ordering system.

## Future Scope (Phase 3+)
- Community circuit sharing.
- Gamification (Points and badges for tutorials).
