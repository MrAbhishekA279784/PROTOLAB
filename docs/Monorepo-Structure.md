# Monorepo Structure

We will use Turborepo / Yarn Workspaces to manage the application as a monorepo, separating concerns between frontend, backend APIs, and shared packages.

```text
protolab-monorepo/
├── apps/
│   ├── web/                     # Next.js Frontend (Shop, Lab, Dashboard)
│   │   ├── src/
│   │   │   ├── app/             # App Router pages
│   │   │   ├── components/      # React components (UI + Canvas)
│   │   │   ├── store/           # Zustand state (Simulation, Cart)
│   │   │   └── styles/          # Tailwind globals
│   │   ├── package.json
│   │   └── next.config.mjs
│   ├── api/                     # Node.js/Express Backend Core
│   │   ├── src/
│   │   │   ├── controllers/     # Route logic
│   │   │   ├── services/        # Business logic (e.g., Razorpay integration)
│   │   │   └── routes/          # Express routers
│   │   └── package.json
│   └── ai-service/              # Python microservice (FastAPI - Future)
│       └── src/                 # Computer vision circuit analysis
├── packages/
│   ├── ui/                      # Shared component library (Buttons, Modals) - Tailwind
│   ├── database/                # Prisma schema and client exports
│   │   ├── prisma/schema.prisma
│   │   └── src/index.ts
│   ├── simulation-engine/       # Core physics/logic engine (Agnostic to UI)
│   │   ├── src/engine.ts
│   │   ├── src/components/      # Logic definitions for Resistor, LED, MCU
│   │   └── package.json
│   ├── eslint-config/           # Shared ESLint configuration
│   └── typescript-config/       # Shared tsconfig.json base files
├── package.json
├── turbo.json                   # Turborepo build pipelines
└── README.md
```
