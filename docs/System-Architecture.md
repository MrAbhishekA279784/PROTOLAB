# System Architecture

## High-Level Overview
ProtoLab is a modern, modular Monolith (with microservices for heavy tasks) built on a serverless-friendly tech stack, separating the frontend UI/simulation from backend commerce and heavy compute tasks.

## Client (Frontend)
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS, custom UI Design System (Clean SaaS, White/Primary #4F6EF7/Accent #6FD3C1).
- **Simulation/3D:** Three.js for 3D model viewing, HTML5 Canvas / SVG for 2D UI breadboard simulation.
- **IDE:** Monaco Editor integration for the coding environment.
- **State Management:** Zustand / Redux Toolkit for complex simulation state synchronization.

## Server (Backend)
- **Framework:** Node.js with Express (REST / GraphQL API).
- **Auth:** Supabase Auth (JWT, OAuth).
- **Database:** PostgreSQL (hosted on Supabase) with Prisma ORM.
- **File Storage:** AWS S3 / Supabase Storage (Datasheets, STL files, Gerbers).
- **Real-time:** Socket.io or Supabase Realtime for live AI feedback and simulation telemetry.

## Integrations & Microservices
- **AI Engine:** OpenAI API wrapper service. Future: Dedicated Python microservice for Computer Vision (image to circuit).
- **Code Execution:** WebAssembly (WASM) based AVR/ESP emulator (e.g., AVR8js) running securely in the browser, with backend fallback via secure Docker sandboxes (Firecracker).
- **Payments:** Razorpay API.
- **Logistics:** Shiprocket API.

## Architecture Diagram (Mental Model)
```text
[ Web Browser (Next.js) ]
  ├── Simulation Engine (Canvas) <==== Sync ====> Code Runner (WASM/Monaco)
  ├── E-Commerce UI
  ├── PCB / 3D Viewer (Three.js)
  └── AI Chat UI

        | (HTTPS / WSS)
        v
[ API Gateway (Node.js/Express) ]
  ├── Auth Middleware
  ├── Commerce Service (Products, Cart, Order) ---> Razorpay / Shiprocket
  ├── User Projects Service ---> PostgreSQL (Supabase)
  └── AI Orchestrator ---> OpenAI API / Vision API
```
