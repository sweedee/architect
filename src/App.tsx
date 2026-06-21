import { useCallback, useRef, type DragEvent } from 'react'
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Palette, PALETTE_DRAG_TYPE } from './components/Palette'
import { ComponentNode } from './components/ComponentNode'
import { COMPONENT_BY_KIND } from './data/components'
import { useGraphStore, type ArchitectureNode } from './store/useGraphStore'
import type { ComponentKind } from './types'

const nodeTypes = { component: ComponentNode }

let nextNodeId = 1

function Canvas() {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const onNodesChange = useGraphStore((s) => s.onNodesChange)
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange)
  const onConnect = useGraphStore((s) => s.onConnect)
  const addNode = useGraphStore((s) => s.addNode)
  const { screenToFlowPosition } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const kind = event.dataTransfer.getData(PALETTE_DRAG_TYPE) as ComponentKind
      const def = COMPONENT_BY_KIND[kind]
      if (!def) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const node: ArchitectureNode = {
        id: `node-${nextNodeId++}`,
        type: 'component',
        position,
        data: { kind: def.kind, label: def.label },
      }
      addNode(node)
    },
    [addNode, screenToFlowPosition],
  )

  return (
    <div ref={wrapperRef} className="h-full flex-1" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex h-screen w-screen">
      <ReactFlowProvider>
        <Palette />
        <Canvas />
      </ReactFlowProvider>
    </div>
  )
}
