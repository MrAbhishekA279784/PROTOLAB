# Information Architecture

## Sitemap & Navigation
1. **Public/Marketing Pages**
   - Home (/): Value proposition, featured kits.
   - About (/about): Mission, team.
   - Pricing (/pricing): Free tier vs Maker Pro tier.

2. **E-Commerce Shop**
   - Shop Home (/shop): Categories (Components, Kits, Tools).
   - Component Category (/shop/components): Filters (Resistors, Capacitors, ICs).
   - Product Detail Page (/shop/product/[id]): Buy Now, Add to Cart, Simulate Now.

3. **Workspace (The Lab)**
   - Dashboard (/dashboard): Recent projects, saved circuits.
   - Simulation Lab (/lab/sim/[id]): 2D breadboard canvas, components bin, code editor toggle.
   - PCB Editor (/lab/pcb/[id]): 2D routing canvas, layers panel.
   - 3D Viewer (/lab/3d/[id]): WebGL viewer for STLs.

4. **User & Account**
   - Profile (/profile): Basic info, order history.
   - Smart Cart (/cart): Items, quick simulate button, checkout flow.
   - Settings (/settings): Preferences, API keys, address book.

## Page Layouts & Hierarchy
- **Top Navigation Bar:** Global search (components/tutorials), Shop, Lab, Community, Cart icon, Profile dropdown.
- **Lab Interface Layout:**
  - *Left Sidebar:* Component library (searchable, drag-and-drop).
  - *Center Canvas:* Infinite panning grid for the circuit/PCB.
  - *Right Sidebar/Drawer:* Properties panel (for selected component), AI Assistant (Electron) chat interface.
  - *Bottom Panel (Collapsible):* Monaco Code Editor and Serial Monitor terminal.
