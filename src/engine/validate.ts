import type { Edge } from '@xyflow/react'
import { RULES } from './rules'
import type { ArchitectureNode } from '../store/useGraphStore'
import type { Scenario, ScoreCategory, ValidationReport } from '../types'

const CATEGORIES: ScoreCategory[] = ['reliability', 'scalability', 'cost', 'simplicity']

export function runValidation(
  nodes: ArchitectureNode[],
  edges: Edge[],
  scenario: Scenario,
): ValidationReport {
  const results = RULES.map((rule) => ({
    ruleId: rule.id,
    label: rule.label,
    category: rule.category,
    ...rule.evaluate({ nodes, edges, scenario }),
  }))

  const categoryScores = Object.fromEntries(
    CATEGORIES.map((category) => {
      const applicable = results.filter((r) => r.category === category && r.applicable)
      if (applicable.length === 0) return [category, 100]
      const passedCount = applicable.filter((r) => r.passed).length
      return [category, Math.round((passedCount / applicable.length) * 100)]
    }),
  ) as Record<ScoreCategory, number>

  const overallScore = Math.round(
    CATEGORIES.reduce((sum, category) => sum + categoryScores[category], 0) / CATEGORIES.length,
  )

  return {
    results,
    categoryScores,
    overallScore,
    passed: overallScore >= scenario.passingScore,
  }
}
