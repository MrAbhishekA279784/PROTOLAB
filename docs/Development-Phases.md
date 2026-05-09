# Development Phases

## Phase 1: Core E-Commerce & Foundation (Weeks 1-4)
- Set up Monorepo (Next.js, UI packages).
- Configure Supabase (Auth, Postgres, Storage).
- Build E-Commerce UI (Products, PDP, Cart) and Razorpay integration.
- Implement User Dashboard and Project saving logic.

## Phase 2: The Simulation Lab & IDE (Weeks 5-9)
- Build React-based 2D Canvas for breadboard Drag & Drop.
- Integrate Monaco Editor.
- Implement WASM-based AVR8js compiler/emulator pipeline.
- Connect Simulation Engine (MNA solver) to evaluate currents/voltages based on MCU pin states.

## Phase 3: AI Integration & "Smart Cart" (Weeks 10-12)
- Implement AI Assistant UI panel.
- Build "Context Builders" that serialize the Canvas JSON and Code into LLM prompts.
- Implement "Smart Cart" -> "Simulate" data pipeline.

## Phase 4: PCB & 3D Viewer (Weeks 13-15)
- Build PCB routing canvas (Grid-based, Layer toggles).
- Implement Gerber file exporter based on canvas state.
- Integrate Three.js WebGL viewer for STL/STEP files.
- Connect PCB manufacturing pricing API.

## Phase 5: Testing, QA & Launch (Weeks 16-18)
- End-to-end Cypress testing for the Cart to Simulation flow.
- Load testing the compiler API.
- Beta release to university students for feedback.
- Final bug fixes and V1 Release.
