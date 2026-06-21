import type { Scenario } from '../types'

export function RequirementsPanel({ scenario }: { scenario: Scenario }) {
  const r = scenario.requirements

  return (
    <div className="border-b border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-800">{scenario.title}</h2>
      <p className="mt-1 text-xs text-slate-600">{scenario.description}</p>
      <dl className="mt-3 grid grid-cols-2 gap-y-1 text-xs text-slate-700">
        <dt className="text-slate-500">Writes/sec</dt>
        <dd>{r.writesPerSecond.toLocaleString()}</dd>
        <dt className="text-slate-500">Reads/sec</dt>
        <dd>{r.readsPerSecond.toLocaleString()}</dd>
        <dt className="text-slate-500">Uptime SLA</dt>
        <dd>{r.uptimeSlaPercent}%</dd>
        <dt className="text-slate-500">Consistency</dt>
        <dd>{r.consistency}</dd>
        <dt className="text-slate-500">Budget</dt>
        <dd>${r.budgetPerMonth}/mo</dd>
      </dl>
    </div>
  )
}
