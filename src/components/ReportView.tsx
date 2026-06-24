import type { ValidationReport } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  reliability: 'Reliability',
  scalability: 'Scalability',
  cost: 'Cost',
  simplicity: 'Simplicity',
}

/** Renders the score banner, category breakdown, and per-rule results for a report. */
export function ReportView({ report }: { report: ValidationReport }) {
  return (
    <div>
      <div
        className={`rounded-md p-2 text-center text-sm font-semibold ${
          report.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}
      >
        {report.overallScore}/100 — {report.passed ? 'Pass' : 'Needs work'}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {Object.entries(report.categoryScores).map(([category, score]) => (
          <div key={category} className="rounded border border-slate-200 p-2">
            <div className="text-slate-500">{CATEGORY_LABELS[category] ?? category}</div>
            <div className="font-semibold text-slate-800">{score}</div>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2 text-xs">
        {report.results
          .filter((r) => r.applicable)
          .map((r) => (
            <li
              key={r.ruleId}
              className={`rounded border-l-4 p-2 ${
                r.passed ? 'border-emerald-400 bg-emerald-50' : 'border-rose-400 bg-rose-50'
              }`}
            >
              <span className="font-medium">
                {r.passed ? '✓' : '✗'} {r.label}
              </span>
              <p className="mt-0.5 text-slate-600">{r.message}</p>
            </li>
          ))}
      </ul>
    </div>
  )
}
