# Graph Report - proto-circuit-studio-main  (2026-05-11)

## Corpus Check
- 99 files · ~41,915 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 167 nodes · 147 edges · 46 communities (42 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `433ba7e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Utilities|Core Utilities]]
- [[_COMMUNITY_Toast Notifications|Toast Notifications]]
- [[_COMMUNITY_Sketch Execution Adapters|Sketch Execution Adapters]]
- [[_COMMUNITY_Authentication & Modals|Authentication & Modals]]
- [[_COMMUNITY_Simulation History|Simulation History]]
- [[_COMMUNITY_Community Post Components|Community Post Components]]
- [[_COMMUNITY_AI Assistant|AI Assistant]]
- [[_COMMUNITY_Inspector Panel|Inspector Panel]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 46 edges
2. `SimulationLab()` - 5 edges
3. `toast()` - 4 edges
4. `useToast()` - 4 edges
5. `AuthButtons()` - 3 edges
6. `Toaster()` - 3 edges
7. `sendMessage()` - 3 edges
8. `compileSketch()` - 3 edges
9. `uploadSketch()` - 3 edges
10. `useSimulationHistory()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Toaster()` --calls--> `useToast()`  [INFERRED]
  src/components/ui/toaster.tsx → src/hooks/use-toast.ts
- `SimulationLab()` --calls--> `useCollaboration()`  [INFERRED]
  src/features/simulation/components/simulation-lab.tsx → src/store/useCollaboration.ts
- `SimulationLab()` --calls--> `useSimulationViewport()`  [INFERRED]
  src/features/simulation/components/simulation-lab.tsx → src/features/simulation/hooks/use-simulation-viewport.ts
- `SimulationLab()` --calls--> `useWireSystem()`  [INFERRED]
  src/features/simulation/components/simulation-lab.tsx → src/features/simulation/hooks/use-wire-system.ts
- `SimulationLab()` --calls--> `useSimulationHistory()`  [INFERRED]
  src/features/simulation/components/simulation-lab.tsx → src/features/simulation/hooks/use-simulation-history.ts

## Communities (46 total, 4 thin omitted)

### Community 2 - "Sketch Execution Adapters"
Cohesion: 0.23
Nodes (6): BOMEstimator(), SimulationLab(), useSimulationHistory(), useSimulationViewport(), useWireSystem(), useCollaboration()

### Community 3 - "Authentication & Modals"
Cohesion: 0.33
Nodes (7): addToRemoveQueue(), dispatch(), genId(), reducer(), toast(), useToast(), Toaster()

### Community 8 - "Community Post Components"
Cohesion: 0.7
Nodes (3): compileSketch(), installLibrary(), uploadSketch()

### Community 10 - "AI Assistant"
Cohesion: 0.83
Nodes (3): getSmartResponse(), handleKeyDown(), sendMessage()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Core Utilities` to `Simulation Lab`, `Simulation History`, `Accordion UI`, `Breadcrumb UI`, `Chart UI`, `Carousel UI`, `Calendar UI`, `Form UI`, `Resizable Layout`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `Toaster()` connect `Authentication & Modals` to `Toast Notifications`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `SimulationLab()` (e.g. with `useCollaboration()` and `useSimulationViewport()`) actually correct?**
  _`SimulationLab()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `Core Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Toast Notifications` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._