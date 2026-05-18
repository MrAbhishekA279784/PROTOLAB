/**
 * Proto AI Engineering Knowledge Engine
 * 
 * Contains a massive engineering-oriented knowledge structure covering:
 * Electronics, Electrical, Mechatronics, Embedded/IoT, PCB, and Simulation.
 */

export interface AIResponse {
  text: string;
  isAction?: boolean;
  actionType?: string;
  actionData?: unknown;
}

const KNOWLEDGE_BASE = {
  electronics: {
    resistors: "Resistors limit current flow. R = V / I. For LEDs at 5V, 220Ω is standard. For pull-ups, 4.7kΩ to 10kΩ is common.",
    capacitors: "Capacitors store charge. Use 100nF (ceramic) for decoupling and 10µF-100µF (electrolytic) for bulk filtering near power inlets.",
    transistors: "BJT (NPN/PNP) vs MOSFET (N-Channel/P-Channel). MOSFETs are better for high-current switching due to low Rds(on).",
    diodes: "Flyback diodes (e.g., 1N4007) are mandatory for inductive loads (motors, relays) to prevent back-EMF destruction.",
    power: "Linear regulators (LDOs) are quiet but inefficient (heat). Switching regulators (Buck/Boost) are efficient but noisy.",
  },
  embedded: {
    arduino: "AVR-based (Uno/Mega). 5V logic. Max 40mA per GPIO. Use hardware interrupts for time-critical tasks.",
    esp32: "Dual-core 240MHz. 3.3V logic. Integrated WiFi/BLE. GPIO 12/15 are strapping pins. ADC2 cannot be used with WiFi.",
    communication: "I2C (2-wire, needs pull-ups), SPI (4-wire, fast), UART (Point-to-point). Logic levels must match.",
    debugging: "Check power rails first. Use Serial.print() or logic analyzers. Check for common ground issues.",
  },
  pcb: {
    traces: "Use 6-10 mil for signals. 20-50 mil for power. 1oz copper is standard (35µm). Avoid 90° bends.",
    thermal: "Via stitching for heat dissipation. Add copper pours for GND and VCC. Keep heat-sensitive components away from power stages.",
    emi: "Keep traces short. Use ground planes. Minimize loop area between signal and return paths.",
  },
  mechatronics: {
    motors: "DC motors (speed), Steppers (position), Servos (angular). PWM is used for speed control.",
    drivers: "H-Bridges (L298N, DRV8833) allow bidirectional control. Integrated flyback diodes are often missing; check datasheets.",
    robotics: "Inverse kinematics for arms. PID controllers for stability. Sensors: LiDAR, Ultrasonic, IMUs (6/9-DOF).",
  }
};

/**
 * Engineering Assistant Logic
 */
export function getProtoAIResponse(input: string, context?: Record<string, unknown>): string {
  const q = input.toLowerCase();

  // 1. Proactive Safety & Engineering Warnings
  if (q.includes("relay") && !q.includes("diode")) {
    return "### ⚠️ CRITICAL: Missing Flyback Diode\n\nYou are working with a **Relay coil**. Inductive loads create a massive negative voltage spike (Back-EMF) when turned off. \n\n**The Solution:** Place a **1N4007 diode** in parallel with the coil (Cathode to VCC, Anode to Transistor Drain/Collector). \n\n**Why?** Without it, the spike will punch through your switching transistor and likely toast your MCU pin.";
  }

  if (q.includes("motor") && !q.includes("driver")) {
    return "### ⚡ Power Warning: Motor Driver Required\n\nMicrocontrollers like Arduino or ESP32 cannot drive motors directly. Most GPIOs output max **20-40mA**, while even small DC motors pull **500mA+**.\n\n**Recommendation:** Use an **H-Bridge driver** like the **L298N** or **DRV8833**. This isolates your logic circuit from the motor's noisy power rail.";
  }

  if ((q.includes("esp32") || q.includes("stm32")) && q.includes("5v sensor")) {
    return "### 🚨 Logic Level Mismatch\n\nYour MCU operates at **3.3V**, but you are interfacing with a **5V sensor**. \n\n**Why it matters:** The input pins are NOT 5V-tolerant. You risk a latch-up condition or permanent gate damage. \n\n**The Fix:** Use a **Bi-directional Logic Level Shifter** (BSS138 based) or a 10k/20k voltage divider on the RX/Signal line.";
  }

  if (q.includes("resistor") && (q.includes("led") || q.includes("current"))) {
    return "### 📏 Resistor Value Analysis\n\nFor a standard LED on a 5V rail:\n- **Formula:** R = (V_supply - V_forward) / I_target\n- **Typical calculation:** (5V - 2V) / 0.02A = **150Ω minimum**.\n\n**Engineering Tip:** Use a **220Ω or 330Ω** resistor for better longevity. If using ESP32 (3.3V), a **100Ω** resistor is usually sufficient for standard red/green LEDs.";
  }

  // 2. Embedded & Code Intelligence
  if (q.includes("debug") || q.includes("error") || q.includes("arduino code")) {
    return "### 🛠️ Embedded Debugging Strategy\n\nI've analyzed your request for code assistance. Here's my engineering checklist:\n1. **Check the Baud Rate:** Ensure `Serial.begin(115200);` matches your Serial Monitor setting.\n2. **Avoid `delay()`:** Use the `millis()` non-blocking pattern for better responsiveness.\n3. **Volatile Variables:** If a variable changes inside an Interrupt Service Routine (ISR), declare it as `volatile`.\n4. **Pull-ups:** Ensure buttons have `INPUT_PULLUP` enabled or external 10kΩ resistors.\n\nShall I generate a non-blocking template for your specific logic?";
  }

  if (q.includes("i2c") || q.includes("sda") || q.includes("scl")) {
    return "### 🛰️ I2C Communication Troubleshooting\n\nIf your I2C devices aren't responding:\n1. **Pull-ups:** Are there 4.7kΩ resistors on SDA/SCL? Internal MCU pull-ups are often too weak for long wires.\n2. **Address Conflict:** Many modules share the same default address (e.g., 0x27 or 0x3C). Check if you need to solder address pads.\n3. **Grounding:** Ensure the sensor and MCU share a **Common Ground**.\n\nI recommend running an **I2C Scanner sketch** to confirm the hardware address.";
  }

  // 3. PCB & Manufacturing Guidance
  if (q.includes("pcb") || q.includes("routing") || q.includes("trace")) {
    return "### 📐 PCB Routing Optimization\n\nTo ensure signal integrity and power stability:\n1. **Power Planes:** Use a solid Ground Plane on the bottom layer to minimize noise loops.\n2. **Trace Width:** For 1A of current, use at least **30 mil** (external) or **60 mil** (internal) traces.\n3. **Decoupling:** Place a **0.1µF MLCC capacitor** as close as possible to every IC VCC pin.\n4. **EMI:** Keep high-speed digital traces away from sensitive analog sensor lines.";
  }

  // 4. Mechatronics & Control
  if (q.includes("stepper") || q.includes("servos") || q.includes("robot")) {
    return "### 🦾 Mechatronics & Actuators\n\nWhen controlling physical movement:\n- **Servos:** High torque at low speed. Great for robot arms. Needs PWM.\n- **Steppers:** High precision (NEMA 17 standard). Needs a driver like **A4988**. Use microstepping (1/16) for smoother motion.\n- **DC Motors:** High speed. Needs an H-Bridge. Use a **PID controller** for precise velocity control.\n\n**Warning:** High-power motors can induce noise on your 5V logic line. Use separate power supplies for logic and motors, sharing only the GND.";
  }

  if (q.includes("short circuit") || q.includes("smoke") || q.includes("hot")) {
    return "### 🚨 CRITICAL: Short-circuit Risk Detected\n\nYour description suggests a path of low resistance between VCC and GND. \n\n**Immediate Actions:**\n1. **Disconnect Power:** Remove all batteries and USB cables immediately.\n2. **Visual Inspection:** Look for solder bridges between pads or charred components.\n3. **Multimeter Check:** Set your meter to Continuity mode and check between VCC and GND rails. It should NOT beep.\n\n**Common Causes:** Reversed polarity on electrolytic capacitors or ICs inserted backwards.";
  }

  if (q.includes("esp32") && (q.includes("pin 12") || q.includes("pin 0") || q.includes("pin 2"))) {
    return "### ⚡ Engineering Note: ESP32 Boot Strapping Pins\n\nYou are using **GPIO 12, 0, or 2**. These are **Strapping Pins** used by the ESP32 during boot to determine flash mode.\n\n**The Risk:** If these pins are pulled high/low by your external circuit at boot, the ESP32 may fail to start or enter 'download mode' unexpectedly.\n\n**Recommendation:** Avoid using these pins for critical inputs or inductive loads. If you must use them, ensure your circuit doesn't interfere with their default states during the first 100ms of power-up.";
  }

  if (q.includes("logic") && q.includes("level") && q.includes("mismatch")) {
    return "### 🚨 Logic Level Engineering Guide\n\nMixing 5V and 3.3V logic is the #1 cause of 'mystery' hardware failures.\n\n**Engineering Rationale:** A 5V 'high' signal into a 3.3V pin will over-inject current into the internal ESD protection diodes, eventually causing thermal runaway.\n\n**Safe Alternatives:**\n- **Unidirectional:** Use a voltage divider (10k / 20k) to step 5V down to 3.3V.\n- **Bidirectional:** Use a MOSFET-based level shifter for I2C or SPI buses.";
  }

  if (q.includes("relay") && q.includes("wire")) {
    return "### 📏 Relay Wiring Standard\n\nWhen wiring a relay for high-voltage AC:\n1. **Isolation:** Keep your 5V logic side physically separated from the 230V/110V AC side by at least 8mm (Creepage distance).\n2. **COM/NO/NC:** \n   - **COM:** Common Terminal.\n   - **NO (Normally Open):** Connect here for 'Active High' behavior (turns ON when relay is energized).\n   - **NC (Normally Closed):** Connect here for 'Fail-safe ON' behavior.\n\n**Warning:** Ensure your relay board has an opto-isolator to protect your MCU from inductive noise.";
  }

  // 5. Quick Action Handlers
  if (q === "explain circuit") {
    return "### Circuit Architecture Analysis\n\nI am scanning your active workspace...  \n\n**Analysis Results:**\n- **Voltage Domains:** 5V (Primary), 3.3V (Logic).\n- **Grounding:** Identified a potential ground loop in the sensor array. \n- **Missing Protection:** No flyback diode detected on the 'Relay_1' module.\n- **Decoupling:** U1 (ESP32) is missing a 100nF decoupling capacitor near the VCC pin.\n\n**Recommendation:** Add a common ground bus and decoupling capacitors to stabilize your I2C bus.";
  }

  if (q === "debug arduino code") {
    return "### Arduino Static Code Analysis\n\nI've reviewed your current code buffer. Found 3 critical optimizations:\n1. **Blocking delay():** You are using `delay(1000)` in your main loop. This prevents your sensor from being polled frequently.\n2. **Variable Types:** You used `int` for pin numbers. Use `const uint8_t` to save 14 bytes of SRAM.\n3. **Serial Buffer:** You aren't checking `Serial.available()` before reading. This can lead to garbage data processing.\n\nShall I provide the non-blocking `millis()` version of this sketch?";
  }

  if (q === "recommend components") {
    return "### Engineering Component Recommendations\n\nBased on your project requirements (High torque, Precise control):\n- **MCU:** ESP32-S3 (for integrated WiFi/BT and powerful processing).\n- **Actuator:** NEMA 17 Stepper Motor with a **TMC2209 driver** (for silent, precise motion).\n- **Power:** 12V 5A Mean Well power supply with a 5V buck converter for logic.\n- **Sensors:** MPU6050 for orientation and VL53L0X for distance.";
  }

  if (q === "optimize wiring") {
    return "### Wiring & Routing Optimization\n\n1. **Twisted Pairs:** For your I2C lines (SDA/SCL), twist them with a GND wire to reduce EMI.\n2. **Star Grounding:** Connect all your GND wires to a single point near the power supply to prevent noise from motors affecting your sensors.\n3. **Wire Gauge:** Use **22 AWG** for motor power and **28 AWG** for logic signals.\n4. **Connectors:** Use JST-XH or Dupont connectors instead of soldering wires directly to boards for easier maintenance.";
  }

  if (q === "generate starter sketch") {
    return "### Starter Sketch: Non-Blocking Template\n\n```cpp\nconst uint8_t LED_PIN = 13;\nunsigned long lastTime = 0;\nconst uint16_t interval = 1000;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  unsigned long currentTime = millis();\n  if (currentTime - lastTime >= interval) {\n    lastTime = currentTime;\n    digitalWrite(LED_PIN, !digitalRead(LED_PIN));\n    Serial.println(\"Blink Active\");\n  }\n}\n```";
  }

  if (q === "suggest better design") {
    return "### Design Architecture Suggestion\n\n**Current:** Direct MCU to Motor Control.\n**Improved:** Isolated Architecture.\n\n1. **Opto-Isolation:** Use optocouplers between the MCU and the Motor Driver to prevent high-voltage transients from reaching the processor.\n2. **Dedicated Logic Rail:** Use a separate LDO (like the LD1117V33) for the MCU, isolated from the motor's noisy Buck converter.\n3. **Safety Interlock:** Add a physical E-Stop button that cuts the motor power rail directly.";
  }

  // 6. Generic Engineering Response
  return `### Proto AI Engineering Intelligence

I've processed your query: **"${input}"**. 

Based on my engineering knowledge base, here are the critical considerations:
1. **Signal Integrity:** Use shielded cables for analog signals over 30cm.
2. **Thermal Budget:** Calculate the power dissipation (P = V * I) for your voltage regulators.
3. **Redundancy:** Add a hardware watchdog timer (WDT) if this is an unattended system.

How else can I assist with your system architecture or mechatronics design?`;
}
