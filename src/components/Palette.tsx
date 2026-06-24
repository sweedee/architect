import { COMPONENT_CATALOG } from '../data/components'
import { useGraphStore } from '../store/useGraphStore'
import type { ComponentKind } from '../types'

interface PaletteProps {
  /** 'rail' = vertical desktop sidebar, 'bar' = horizontal mobile chip strip. */
  variant?: 'rail' | 'bar'
}

export function Palette({ variant = 'rail' }: PaletteProps) {
  const selectedKind = useGraphStore((s) => s.selectedKind)
  const setSelectedKind = useGraphStore((s) => s.setSelectedKind)

  const toggle = (kind: ComponentKind) =>
    setSelectedKind(selectedKind === kind ? null : kind)

  if (variant === 'bar') {
    return (
      <div className="flex gap-2 overflow-x-auto px-3 py-2">
        {COMPONENT_CATALOG.map((def) => {
          const active = selectedKind === def.kind
          return (
            <button
              key={def.kind}
              type="button"
              onClick={() => toggle(def.kind)}
              className={`shrink-0 rounded-md border-2 px-3 py-2 text-sm font-medium shadow-sm transition active:scale-95 ${def.accentClass} ${
                active ? 'ring-2 ring-slate-900 ring-offset-1' : ''
              }`}
            >
              {def.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-3">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Components
      </h2>
      <p className="mb-3 text-xs text-slate-400">Tap one, then tap the canvas to place it.</p>
      <div className="flex flex-col gap-2">
        {COMPONENT_CATALOG.map((def) => {
          const active = selectedKind === def.kind
          return (
            <button
              key={def.kind}
              type="button"
              onClick={() => toggle(def.kind)}
              title={def.description}
              className={`rounded-md border-2 px-3 py-2 text-left text-sm font-medium shadow-sm transition active:scale-[0.98] ${def.accentClass} ${
                active ? 'ring-2 ring-slate-900 ring-offset-1' : ''
              }`}
            >
              {def.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
