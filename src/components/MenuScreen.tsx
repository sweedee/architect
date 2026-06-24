import { SCENARIOS } from '../data/scenarios'
import { useGraphStore } from '../store/useGraphStore'

export function MenuScreen() {
  const progress = useGraphStore((s) => s.progress)
  const openScenario = useGraphStore((s) => s.openScenario)

  return (
    <div className="h-screen w-screen overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Architect</h1>
          <p className="mt-2 text-sm text-slate-600">
            Design a system that meets the brief. Place components, wire them together, and
            validate your architecture against the requirements.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Choose a challenge
          </h2>
          <ul className="flex flex-col gap-3">
            {SCENARIOS.map((s) => {
              const p = progress[s.id]
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => openScenario(s.id)}
                    className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow active:scale-[0.99]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{s.title}</span>
                        {p?.passed && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            ✓ Passed
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{s.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-lg font-bold text-slate-800">
                        {p?.bestScore ?? 0}
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </div>
                      <div className="text-[11px] text-slate-400">best score</div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            How to play
          </h2>
          <ol className="list-inside list-decimal space-y-1 text-sm text-slate-600">
            <li>Tap a component, then tap the canvas to place it.</li>
            <li>Drag from a node's bottom dot to another node's top dot to connect them.</li>
            <li>Tap a node or edge to select it, then use Delete to remove it.</li>
            <li>Hit Validate to score your design against the requirements.</li>
          </ol>
        </section>
      </div>
    </div>
  )
}
