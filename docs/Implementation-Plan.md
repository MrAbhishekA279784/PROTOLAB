# Implementation Plan

## Overview
This document serves as the master execution guide for the AI coding agents to begin building ProtoLab based on the 17 preceding blueprint documents.

## Step 1: Repository Initialization
- Initialize Turborepo.
- Scaffold `apps/web` (Next.js App Router).
- Scaffold `packages/ui`, `packages/database`, `packages/simulation-engine`.
- Configure Tailwind CSS, ESLint, and Prettier across all workspaces.

## Step 2: Database & Backend Setup
- Initialize Supabase project.
- Write `schema.prisma` mapping to the `Database-Schema.md` definitions.
- Generate Prisma Client and run initial migrations.
- Set up Supabase Auth context in `apps/web`.

## Step 3: E-Commerce UI MVP
- Build Product List and Product Detail Pages.
- Implement Zustand Cart store.
- Integrate Razorpay test mode for complete checkout flow.

## Step 4: The Simulation Lab MVP
- Implement the Zoom/Pan React Canvas.
- Build the Left Sidebar Component Library.
- Implement Drag and Drop to Canvas.
- Integrate Monaco Editor in the collapsible bottom panel.

## Step 5: Engine Integration
- Port or implement the MNA visualizer (`simulation-engine`).
- Set up Web Worker for AVR8js.
- Wire the Play button to compile code, run Emulator, and sync states.

## Step 6: AI Assistant
- Build the sliding right drawer.
- Implement OpenAI API route with streaming.
- Build context extractor (Canvas JSON -> Stringified Prompt).

## Step 7: PCB & 3D 
- Implement Three.js canvas in a separate Lab tab.
- Build basic grid click-to-route MVP for PCBs.

## Step 8: Final Polish
- Connect "Smart Cart Simulate" data flow.
- Enforce styling consistency.
- Deploy to Vercel/Supabase Production.
