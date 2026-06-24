import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COMPONENT_BY_KIND } from '../data/components'
import { SCENARIOS } from '../data/scenarios'
import { runValidation } from '../engine/validate'
import type { ArchitectureNodeData, ComponentKind, ValidationReport } from '../types'

export type ArchitectureNode = Node<ArchitectureNodeData>

export type Screen = 'menu' | 'building' | 'result'

interface Design {
  nodes: ArchitectureNode[]
  edges: Edge[]
}

interface ScenarioProgress {
  passed: boolean
  bestScore: number
}

interface GraphState {
  // --- canvas (working copy for the active scenario) ---
  nodes: ArchitectureNode[]
  edges: Edge[]
  // --- game flow ---
  screen: Screen
  scenarioId: string
  report: ValidationReport | null
  // --- placement (tap-to-place) ---
  selectedKind: ComponentKind | null
  // --- persistence ---
  designs: Record<string, Design>
  progress: Record<string, ScenarioProgress>
  nodeCounter: number

  // canvas handlers
  onNodesChange: (changes: NodeChange<ArchitectureNode>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  // placement
  setSelectedKind: (kind: ComponentKind | null) => void
  placeComponent: (kind: ComponentKind, position: { x: number; y: number }) => void

  // node/edge management
  deleteSelected: () => void
  clear: () => void
  hasSelection: () => boolean

  // game flow
  setScreen: (screen: Screen) => void
  openScenario: (scenarioId: string) => void
  goToMenu: () => void
  validate: () => void
  retry: () => void
}

const EMPTY_DESIGN: Design = { nodes: [], edges: [] }

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      screen: 'menu',
      scenarioId: SCENARIOS[0].id,
      report: null,
      selectedKind: null,
      designs: {},
      progress: {},
      nodeCounter: 1,

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) })
      },
      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) })
      },
      onConnect: (connection) => {
        set({
          edges: addEdge(
            {
              ...connection,
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed },
            },
            get().edges,
          ),
        })
      },

      setSelectedKind: (kind) => set({ selectedKind: kind }),

      placeComponent: (kind, position) => {
        const def = COMPONENT_BY_KIND[kind]
        if (!def) return
        const id = `node-${get().nodeCounter}`
        const node: ArchitectureNode = {
          id,
          type: 'component',
          position,
          data: { kind: def.kind, label: def.label },
        }
        set({ nodes: [...get().nodes, node], nodeCounter: get().nodeCounter + 1 })
      },

      deleteSelected: () => {
        const removedNodeIds = new Set(
          get().nodes.filter((n) => n.selected).map((n) => n.id),
        )
        const nodes = get().nodes.filter((n) => !removedNodeIds.has(n.id))
        const edges = get().edges.filter(
          (e) =>
            !e.selected && !removedNodeIds.has(e.source) && !removedNodeIds.has(e.target),
        )
        set({ nodes, edges })
      },

      clear: () => set({ nodes: [], edges: [] }),

      hasSelection: () =>
        get().nodes.some((n) => n.selected) || get().edges.some((e) => e.selected),

      setScreen: (screen) => set({ screen }),

      openScenario: (scenarioId) => {
        const state = get()
        // save the current scenario's working copy before switching
        const designs = {
          ...state.designs,
          [state.scenarioId]: { nodes: state.nodes, edges: state.edges },
        }
        const next = designs[scenarioId] ?? EMPTY_DESIGN
        set({
          designs,
          scenarioId,
          nodes: next.nodes,
          edges: next.edges,
          report: null,
          selectedKind: null,
          screen: 'building',
        })
      },

      goToMenu: () => {
        const state = get()
        // persist the working copy so it survives leaving the builder
        set({
          designs: {
            ...state.designs,
            [state.scenarioId]: { nodes: state.nodes, edges: state.edges },
          },
          screen: 'menu',
          report: null,
          selectedKind: null,
        })
      },

      validate: () => {
        const state = get()
        const scenario =
          SCENARIOS.find((s) => s.id === state.scenarioId) ?? SCENARIOS[0]
        const report = runValidation(state.nodes, state.edges, scenario)

        const prev = state.progress[scenario.id]
        const progress = {
          ...state.progress,
          [scenario.id]: {
            passed: (prev?.passed ?? false) || report.passed,
            bestScore: Math.max(prev?.bestScore ?? 0, report.overallScore),
          },
        }
        set({ report, progress, screen: 'result' })
      },

      retry: () => set({ report: null, screen: 'building' }),
    }),
    {
      name: 'architect-store',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        scenarioId: state.scenarioId,
        designs: state.designs,
        progress: state.progress,
        nodeCounter: state.nodeCounter,
      }),
    },
  ),
)
