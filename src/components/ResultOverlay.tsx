import { SCENARIOS } from '../data/scenarios'
import { useGraphStore } from '../store/useGraphStore'
import { ReportView } from './ReportView'

export function ResultOverlay() {
  const report = useGraphStore((s) => s.report)
  const scenarioId = useGraphStore((s) => s.scenarioId)
  const retry = useGraphStore((s) => s.retry)
  const goToMenu = useGraphStore((s) => s.goToMenu)
  const openScenario = useGraphStore((s) => s.openScenario)

  if (!report) return null

  const index = SCENARIOS.findIndex((s) => s.id === scenarioId)
  const next = report.passed ? SCENARIOS[index + 1] : undefined

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={retry} />
      <div className="overlay-enter relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <div
          className={`mb-3 text-center text-4xl ${report.passed ? 'pass-pop' : 'fail-shake'}`}
        >
          {report.passed ? '🎉' : '🛠️'}
        </div>
        <h2 className="text-center text-lg font-bold text-slate-900">
          {report.passed ? 'Challenge passed!' : 'Not quite there yet'}
        </h2>

        <div className="mt-4">
          <ReportView report={report} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={retry}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Keep building
          </button>
          {next ? (
            <button
              type="button"
              onClick={() => openScenario(next.id)}
              className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-[0.98]"
            >
              Next challenge
            </button>
          ) : (
            <button
              type="button"
              onClick={goToMenu}
              className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-[0.98]"
            >
              Menu
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
