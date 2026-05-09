# Environment & DevOps

## Hosting Infrastructure
- **Frontend (Next.js):** Vercel (Edge network for fast global delivery).
- **Backend API:** Hosted on Render or Railway (Node.js containerized).
- **Database & Auth:** Supabase (managed PostgreSQL, highly available).
- **Compiler/Heavy Compute:** AWS ECS / Lambda (for isolated, secure compilation of unchecked C++ code if WASM fallback is needed).

## CI/CD Pipeline
- **Provider:** GitHub Actions.
- **On Push to Branches:**
  1. Run `eslint` and `prettier` checks.
  2. Run unit tests (Jest/Vitest) for packages.
- **On Pull Request to `main`:**
  1. Build Next.js app.
  2. Run E2E tests (Cypress).
  3. Deploy Preview environment on Vercel.
- **On Merge to `main`:**
  1. Trigger Vercel Production deployment.
  2. Run Prisma schema migrations automatically against production DB (with safety checks).

## Environment Variables Management
- Managed via Vercel Environment Variables.
- Required keys: 
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  - `SHIPROCKET_API_KEY`
