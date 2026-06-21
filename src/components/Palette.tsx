import type { DragEvent } from 'react'
import { COMPONENT_CATALOG } from '../data/components'
import type { ComponentKind } from '../types'

export const PALETTE_DRAG_TYPE = 'application/architect-component'

function onDragStart(event: DragEvent<HTMLDivElement>, kind: ComponentKind) {
  event.dataTransfer.setData(PALETTE_DRAG_TYPE, kind)
  event.dataTransfer.effectAllowed = 'move'
}

export function Palette() {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-3">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Components
      </h2>
      <div className="flex flex-col gap-2">
        {COMPONENT_CATALOG.map((def) => (
          <div
            key={def.kind}
            draggable
            onDragStart={(event) => onDragStart(event, def.kind)}
            title={def.description}
            className={`cursor-grab rounded-md border-2 px-3 py-2 text-sm font-medium shadow-sm active:cursor-grabbing ${def.accentClass}`}
          >
            {def.label}
          </div>
        ))}
      </div>
    </aside>
  )
}
