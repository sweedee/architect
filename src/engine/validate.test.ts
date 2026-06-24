import { describe, expect, it } from 'vitest'
import type { Edge } from '@xyflow/react'
import { runValidation } from './validate'
import { SCENARIOS } from '../data/scenarios'
import type { ArchitectureNode } from '../store/useGraphStore'
import type { ComponentKind } from '../types'

let seq = 0
function node(id: string, kind: ComponentKind): ArchitectureNode {
  return {
    id,
    type: 'component',
    position: { x: seq++ * 10, y: 0 },
    data: { kind, label: id },
  }
}

function edge(source: string, target: string): Edge {
  return { id: `${source}->${target}`, source, target }
}

const urlShortener = SCENARIOS.find((s) => s.id === 'url-shortener')!

describe('runValidation', () => {
  it('passes a well-formed read-heavy design', () => {
    const nodes = [
      node('client', 'client'),
      node('lb', 'load_balancer'),
      node('s1', 'server'),
      node('s2', 'server'),
      node('cache', 'cache'),
      node('db', 'sql_database'),
    ]
    const edges = [
      edge('client', 'lb'),
      edge('lb', 's1'),
      edge('lb', 's2'),
      edge('s1', 'cache'),
      edge('cache', 'db'),
      edge('s2', 'db'),
    ]

    const report = runValidation(nodes, edges, urlShortener)
    expect(report.passed).toBe(true)
    expect(report.overallScore).toBe(100)
  })

  it('fails an empty design', () => {
    const report = runValidation([], [], urlShortener)
    expect(report.passed).toBe(false)
  })

  it('flags a database exposed directly to a client', () => {
    const nodes = [node('client', 'client'), node('db', 'sql_database')]
    const edges = [edge('client', 'db')]

    const report = runValidation(nodes, edges, urlShortener)
    const exposed = report.results.find((r) => r.ruleId === 'no-exposed-database')
    expect(exposed?.passed).toBe(false)
    expect(report.passed).toBe(false)
  })

  it('requires a cache for read-heavy traffic', () => {
    // client -> server -> db, no cache, on a read-heavy scenario
    const nodes = [
      node('client', 'client'),
      node('s1', 'server'),
      node('s2', 'server'),
      node('db', 'sql_database'),
    ]
    const edges = [edge('client', 's1'), edge('s1', 'db'), edge('s2', 'db')]

    const report = runValidation(nodes, edges, urlShortener)
    const cacheRule = report.results.find((r) => r.ruleId === 'cache-for-read-heavy-traffic')
    expect(cacheRule?.applicable).toBe(true)
    expect(cacheRule?.passed).toBe(false)
  })

  it('flags a design that blows the budget', () => {
    const nodes = Array.from({ length: 6 }, (_, i) => node(`db${i}`, 'sql_database'))
    const report = runValidation(nodes, [], urlShortener)
    const budget = report.results.find((r) => r.ruleId === 'within-budget')
    expect(budget?.passed).toBe(false)
  })
})
