import { useGraphStore } from '../store/useGraphStore'

export function CanvasToolbar() {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const deleteSelected = useGraphStore((s) => s.deleteSelected)
  const clear = useGraphStore((s) => s.clear)

  const hasSelection = nodes.some((n) => n.selected) || edges.some((e) => e.selected)
  const hasNodes = nodes.length > 0

  return (
    <div className="absolute right-2 top-2 z-10 flex gap-2">
      {hasSelection && (
        <button
          type="button"
          onClick={deleteSelected}
          className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow transition hover:bg-rose-500 active:scale-95"
        >
          Delete
        </button>
      )}
      {hasNodes && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Clear the whole canvas?')) clear()
          }}
          className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-white active:scale-95"
        >
          Clear
        </button>
      )}
    </div>
  )
}
