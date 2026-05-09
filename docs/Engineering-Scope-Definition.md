# Engineering Scope Definition

## In-Scope (Phase 1 & 2)
### User Experience
- Authentication (Login, Signup, Social Auth).
- Dashboard for managing projects and orders.
- E-Commerce browsing, Cart management, Checkout (Razorpay).
- "Simulate Now" integration from e-commerce to Lab.

### The Lab
- Drag-and-drop 2D breadboard canvas.
- Basic component library (Resistors, LEDs, Switches, Batteries, Arduino Uno, ESP32).
- Schematic routing and PCB basic Layout (2-layer).
- 3D model viewer for STL/STEP files.
- Monaco-based IDE with C++ syntax highlighting.
- Integration with external/WASM compiler and emulator.

### AI Assistant
- Chat interface powered by OpenAI API.
- Context-aware prompts (sending current circuit JSON and code to the LLM).
- "Explain circuit" and "Debug code" features.

## Out-of-Scope (Future Phases)
- Custom-built Physics Engine from scratch (Phase 1 will use existing open-source MNA solvers or WASM ports).
- Multi-player real-time collaborative editing (Google Docs style).
- Advanced auto-routing for PCBs (users must route manually initially).
- Custom 3D modeling within the browser (users can only *view* uploaded models).
- Complex RF or high-frequency analog simulation.
