import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react'
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
import { RequirementsPanel } from './components/RequirementsPanel'
import { ValidationPanel } from './components/ValidationPanel'
import { COMPONENT_BY_KIND } from './data/components'
import { SCENARIOS } from './data/scenarios'
import { runValidation } from './engine/validate'
import { useGraphStore, type ArchitectureNode } from './store/useGraphStore'
import type { ComponentKind, ValidationReport } from './types'

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
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  )
  const [report, setReport] = useState<ValidationReport | null>(null)
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)

  const handleRun = useCallback(() => {
    setReport(runValidation(nodes, edges, scenario))
  }, [nodes, edges, scenario])

  return (
    <div className="flex h-screen w-screen">
      <ReactFlowProvider>
        <Palette />
        <Canvas />
      </ReactFlowProvider>

      <div className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Scenario
          </label>
          <select
            className="mt-1 w-full rounded border border-slate-300 p-1.5 text-sm"
            value={scenarioId}
            onChange={(event) => {
              setScenarioId(event.target.value)
              setReport(null)
            }}
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <RequirementsPanel scenario={scenario} />
        <ValidationPanel report={report} onRun={handleRun} />
      </div>
    </div>
  )
}
