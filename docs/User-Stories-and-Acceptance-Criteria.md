# User Stories and Acceptance Criteria

## Epic: E-Commerce & Smart Cart
**Story:** As a user, I want to click "Simulate Now" on a product so I can see how it works before buying.
- **AC1:** The button is visible on all compatible component and kit detail pages.
- **AC2:** Clicking the button opens the Simulation Lab workspace with the component isolated or the kit pre-assembled.

**Story:** As a user, I want to simulate my entire cart before checking out to ensure I have all necessary parts.
- **AC1:** The cart UI has a "Simulate Cart" button.
- **AC2:** Clicking loads the Simulation Lab, depositing all cart items into the component bin.

## Epic: Simulation Lab & Coding
**Story:** As a maker, I want to drag and drop components onto a breadboard so I can design a circuit visually.
- **AC1:** Components snap to breadboard grid points.
- **AC2:** Wiring tool connects valid terminals, highlighting visually.

**Story:** As a programmer, I want to write Arduino code and see it run on my simulated circuit.
- **AC1:** Monaco editor provides syntax highlighting for C++.
- **AC2:** Pressing "Run" executes the code in the simulator environment.
- **AC3:** Logic levels (HIGH/LOW) visually update the simulated LEDs/motors.

## Epic: AI Assistant (Electron)
**Story:** As a student, I want to ask the AI to explain a circuit so I can understand why it's built that way.
- **AC1:** The user can select a portion of the circuit and click "Explain".
- **AC2:** The AI responds in the side panel with an accurate, contextual explanation.

## Epic: PCB & 3D Manufacturing
**Story:** As an advanced user, I want to route a PCB and order it directly.
- **AC1:** PCB canvas supports click-to-route.
- **AC2:** "Order PCB" button extracts grid data, calculates cost based on layers/size, and adds to cart.
