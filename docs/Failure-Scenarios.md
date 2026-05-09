# Failure Scenarios & Mitigation

## 1. Code Compilation Fails or Loops Infinitely
- **Scenario:** User writes `while(true) {}` with no delay, freezing the browser.
- **Mitigation:** The WASM emulator MUST run in a Web Worker. The main thread oversees the CPU cycle count. If cycles exceed a threshold without yielding, the main thread terminates the Web Worker and alerts the user.

## 2. AI Hallucinations in Hardware
- **Scenario:** The AI Assistant suggests connecting a 5V source directly to GND or a sensitive 3.3V pin without a resistor, which would burn a physical board.
- **Mitigation:** The AI prompt includes strict system instructions to prioritize safety. Additionally, the Simulation Engine acts as a hard boundary—if the user simulates the AI's bad advice, the UI visually "blows up" the component and displays a warning, preventing real-world damage.

## 3. E-Commerce Inventory Desync
- **Scenario:** User buys a component that just went out of stock.
- **Mitigation:** Implement database transactions (Serializable isolation) during the checkout process. Razorpay payment intent is only created after inventory lock is secured for 10 minutes.

## 4. Heavy Traffic on Compiler API (If using Cloud fallback)
- **Scenario:** 500 students hit the "Compile" button simultaneously during a lab session.
- **Mitigation:** Implement aggressive rate limiting per user IP/Session. Use AWS SQS to queue compilation tasks to prevent server OOM (Out of Memory) crashes.
