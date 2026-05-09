# Core Simulation & Execution Engine Specification

## 1. Objectives
The Core Engine must provide real-time electrical circuit simulation and execute compiled MCU instructions (Arduino/ESP) against that simulated state without relying solely on backend server compute.

## 2. Architecture: Two-Part System

### Part A: The Circuit Solver (TypeScript)
Located via `packages/simulation-engine`.
- **Technique:** Use Modified Nodal Analysis (MNA) to solve voltages and currents for passive components.
- **Tick Rate:** The engine updates state continuously using requestAnimationFrame (linked to visual updates), maintaining a logical clock. 
- **Component Registry:** Every physical part has a logical twin.
  - *Example: LED. Evaluation function checks if Voltage Drop > Forward Voltage and Current < Max Rating limits -> emits `glow: true` or `burnt: true`.*

### Part B: The Code Execution Sandbox (WebAssembly)
- **Compiler:** An API route (`/api/compile`) takes user C++ code and compiles it to an `.elf` / `.hex` binary using an AVR-GCC toolchain in the cloud.
- **Emulation:** The frontend fetches the `.hex` file and loads it into a WASM-based AVR emulator running in a Web Worker (e.g., using a port of AVR8js).
- **MCU Context:** The emulator runs the machine code.

## 3. The Bridge (Syncing Code & Circuit)
1. The WASM Emulator controls the logical GPIO pins of the MCU.
2. The Circuit Solver reads the GPIO states from the Emulator.
3. If pin 13 is set to `HIGH` (5V) by the emulator, the Circuit Solver injects a 5V source at that node in the MNA matrix.
4. The solver computes the new currents/voltages across the breadboard.
5. Connected components (e.g., an LED on pin 13) update their state based on new current values.
6. The UI reads the new component states and renders visually (e.g., LED color changes to red).
7. If the circuit affects inputs (e.g., a button push connects 5V to pin 2), the Solver writes `HIGH` back to the Emulator's GPIO input register.

## 4. Performance Requirements
- Must handle > 100 passive components and 1 MCU in the browser at 30+ frames per second.
- Web Worker mandatory for the Emulator to prevent freezing the main UI thread.
