# Architect

A web-based game where you design software system architectures: drag and drop
components (load balancers, servers, databases, caches, queues, CDNs, etc.) onto a
canvas, wire them together, and validate the design against a scenario's
requirements.

## Status

Early scaffold. Currently: a React Flow canvas with a draggable component palette.
No validation engine, scenarios, or scoring yet — see the brainstorm/plan notes for
the roadmap (MVP rule-based validation → animated load simulation → social features).

## Stack

- React + TypeScript + Vite
- [React Flow (xyflow)](https://reactflow.dev/) for the node/edge canvas
- Zustand for graph state
- Tailwind CSS for styling

## Getting started

```bash
npm install
npm run dev
```
