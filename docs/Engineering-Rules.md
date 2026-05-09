# Engineering Rules & Guidelines

## 1. Frontend Standards
- **Component Driven:** Use functional components and React Hooks implicitly. All UI components reside in `packages/ui` if shared, or `apps/web/src/components` if local.
- **Styling:** Use Tailwind CSS exclusively. No raw CSS files unless required for Three.js specific canvas overlays. Adhere to the defined color palette (Primary #4F6EF7, Accent #6FD3C1).
- **State Separation:** 
  - Server state: Use React Query / SWR.
  - UI state: React `useState`.
  - Complex Lab state (Simulation JSON): Zustand.
- **Strict Typing:** TypeScript in strict mode is mandatory. Use interfaces for API payloads and database models.

## 2. Backend API Standards
- **RESTful Principles:** Use standard HTTP verbs (GET, POST, PUT, DELETE) and appropriate status codes.
- **Validation:** Use Zod for runtime validation of all incoming request bodies and query parameters.
- **Stateless:** APIs must be stateless. Rely on JWT tokens (via Supabase) for user session identification.

## 3. Database Rules
- **No Direct DB Access from Frontend:** Next.js Server Components or API routes must interact with the DB via the `packages/database` Prisma client wrapper.
- **Migrations:** All schema changes must be generated via Prisma migrations (`prisma migrate dev`) and reviewed before staging deployments.

## 4. Simulation Engine Constraints
- **Performance First:** The core `simulation-engine` package must be framework-agnostic (pure TypeScript) and optimized to recalculate state ideally < 16ms to support 60fps React Canvas rendering.
- **Immutability:** Simulation ticks should produce new state objects rather than mutating in place to play nicely with React's rendering cycle.

## 5. Git & CI/CD
- **Branching:** Main branches: `main` (Production), `develop` (Staging). Feature branches: `feat/xxx`, `fix/xxx`.
- **Pre-commit:** Git hooks (Husky) must run ESLint and Prettier before allowing commits.
