import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import { create } from 'zustand'
import type { ArchitectureNodeData } from '../types'

export type ArchitectureNode = Node<ArchitectureNodeData>

interface GraphState {
  nodes: ArchitectureNode[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange<ArchitectureNode>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: ArchitectureNode) => void
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) })
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) })
  },
  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, type: 'default' }, get().edges) })
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
  },
}))
