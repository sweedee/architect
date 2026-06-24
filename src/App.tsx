import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Palette } from './components/Palette'
import { ComponentNode } from './components/ComponentNode'
import { RequirementsPanel } from './components/RequirementsPanel'
import { CanvasToolbar } from './components/CanvasToolbar'
import { BottomSheet } from './components/BottomSheet'
import { MenuScreen } from './components/MenuScreen'
import { ResultOverlay } from './components/ResultOverlay'
import { COMPONENT_BY_KIND } from './data/components'
import { SCENARIOS } from './data/scenarios'
import { useGraphStore } from './store/useGraphStore'

const nodeTypes = { component: ComponentNode }

function Canvas() {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const onNodesChange = useGraphStore((s) => s.onNodesChange)
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange)
  const onConnect = useGraphStore((s) => s.onConnect)
  const selectedKind = useGraphStore((s) => s.selectedKind)
  const setSelectedKind = useGraphStore((s) => s.setSelectedKind)
  const placeComponent = useGraphStore((s) => s.placeComponent)
  const { screenToFlowPosition } = useReactFlow()

  const onPaneClick = useCallback(
    (event: MouseEvent) => {
      if (!selectedKind) return
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
      placeComponent(selectedKind, position)
    },
    [selectedKind, screenToFlowPosition, placeComponent],
  )

  const placingLabel = selectedKind ? COMPONENT_BY_KIND[selectedKind]?.label : null

  return (
    <div className="relative h-full flex-1 touch-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={2}
        panOnDrag
        zoomOnPinch
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      <CanvasToolbar />

      {placingLabel && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg">
            <span>Placing: {placingLabel} — tap the canvas</span>
            <button
              type="button"
              onClick={() => setSelectedKind(null)}
              className="rounded-full bg-white/20 px-2 py-0.5 hover:bg-white/30"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Builder() {
  const scenarioId = useGraphStore((s) => s.scenarioId)
  const goToMenu = useGraphStore((s) => s.goToMenu)
  const validate = useGraphStore((s) => s.validate)
  const screen = useGraphStore((s) => s.screen)
  const nodeCount = useGraphStore((s) => s.nodes.length)
  const [goalOpen, setGoalOpen] = useState(false)

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  )
  const canRun = nodeCount > 0

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          onClick={goToMenu}
          className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          aria-label="Back to menu"
        >
          ‹ Menu
        </button>
        <span className="min-w-0 truncate text-sm font-semibold text-slate-800">
          {scenario.title}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGoalOpen(true)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            Goal
          </button>
          <button
            type="button"
            onClick={validate}
            disabled={!canRun}
            className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white disabled:bg-slate-300"
          >
            Validate
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ReactFlowProvider>
          {/* Desktop palette rail */}
          <div className="hidden md:block">
            <Palette variant="rail" />
          </div>

          <Canvas />

          {/* Desktop right panel */}
          <aside className="hidden w-72 shrink-0 flex-col border-l border-slate-200 bg-white md:flex">
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Challenge
              </span>
              <button
                type="button"
                onClick={goToMenu}
                className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              >
                ‹ Menu
              </button>
            </div>
            <RequirementsPanel scenario={scenario} />
            <div className="p-4">
              <button
                type="button"
                onClick={validate}
                disabled={!canRun}
                className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Run Validation
              </button>
              {!canRun && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  Place some components to validate.
                </p>
              )}
            </div>
          </aside>
        </ReactFlowProvider>
      </div>

      {/* Mobile palette bar */}
      <div className="border-t border-slate-200 bg-white md:hidden">
        <Palette variant="bar" />
      </div>

      {/* Mobile goal sheet */}
      <BottomSheet open={goalOpen} onClose={() => setGoalOpen(false)} title="Challenge goal">
        <RequirementsPanel scenario={scenario} />
      </BottomSheet>

      {screen === 'result' && <ResultOverlay />}
    </div>
  )
}

export default function App() {
  const screen = useGraphStore((s) => s.screen)
  return screen === 'menu' ? <MenuScreen /> : <Builder />
}
