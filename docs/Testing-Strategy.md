# Testing Strategy

## 1. Unit Testing
- **Tool:** Vitest.
- **Focus:** 
  - Core logic in `packages/simulation-engine` (MNA solver math must be rigorously tested with known circuit configurations).
  - Redux/Zustand reducers and state transformations.
  - Utility functions and data serializers.

## 2. Integration Testing
- **Tool:** React Testing Library + MSW (Mock Service Worker).
- **Focus:**
  - Ensuring the UI components render correctly based on state.
  - Testing the bridge between the Monaco Editor code output and the Simulation Engine input.
  - API route testing (mocking Supabase and Razorpay).

## 3. End-to-End (E2E) Testing
- **Tool:** Playwright or Cypress.
- **Critical Paths:**
  1. User logs in -> adds Arduino kit to cart -> clicks "Simulate Cart" -> Lab opens with correct parts.
  2. User writes `digitalWrite(13, HIGH)` -> clicks Run -> Simulator visual LED state turns `true`.
  3. User adds PCB to cart -> completes Razorpay checkout -> Order is created in DB.

## 4. Manual QA & Edge Cases
- Cross-browser testing (Chrome, Safari, Firefox), focusing specifically on WASM performance and WebGL (Three.js) compatibility.
- Testing the AI Assistant with ambiguous hardware questions to ensure graceful fallbacks.
