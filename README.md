# Architect

A web-based game where you design software system architectures: place
components (load balancers, servers, databases, caches, queues, CDNs, etc.) onto a
canvas, wire them together, and validate the design against a scenario's
requirements.

## Status

Playable MVP, mobile-friendly. Includes:

- **Tap-to-place** component palette that works identically with a mouse or by
  touch (the old HTML5 drag-and-drop didn't work on mobile browsers).
- **Responsive layout** — a three-panel desktop view and a phone layout with a
  bottom palette bar and slide-up sheets.
- **Rule-based validation engine** (8 rules) scoring designs across reliability,
  scalability, cost, and simplicity, with several scenarios.
- **Game loop**: a menu / level select, a result overlay, and per-scenario
  progress + designs persisted to `localStorage`.

Roadmap from here: animated load simulation and social features.

## Stack

- React + TypeScript + Vite
- [React Flow (xyflow)](https://reactflow.dev/) for the node/edge canvas
- Zustand (with `persist`) for graph + game state
- Tailwind CSS for styling
- Vitest for the validation-engine tests

## Getting started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run lint     # eslint
npm run test     # run the validation-engine tests (vitest)
```
