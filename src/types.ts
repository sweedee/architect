export type ComponentKind =
  | 'client'
  | 'load_balancer'
  | 'server'
  | 'sql_database'
  | 'nosql_database'
  | 'cache'
  | 'queue'
  | 'cdn'
  | 'object_storage'
  | 'third_party_api'

export interface ComponentDefinition {
  kind: ComponentKind
  label: string
  description: string
  /** Tailwind classes for the node's accent color. */
  accentClass: string
  /** Approximate infrastructure cost in USD/month, used by the budget rule. */
  monthlyCost: number
}

export type ConnectionKind = 'sync' | 'async'

export interface ArchitectureNodeData {
  kind: ComponentKind
  label: string
  [key: string]: unknown
}

export type ScoreCategory = 'reliability' | 'scalability' | 'cost' | 'simplicity'

export interface ScenarioRequirements {
  writesPerSecond: number
  readsPerSecond: number
  uptimeSlaPercent: number
  consistency: 'strong' | 'eventual'
  budgetPerMonth: number
}

export interface Scenario {
  id: string
  title: string
  description: string
  requirements: ScenarioRequirements
  /** Minimum overall score (0-100) needed to pass this scenario. */
  passingScore: number
}

export interface RuleResult {
  ruleId: string
  label: string
  category: ScoreCategory
  /** Whether this rule applies given the current scenario/graph (e.g. the load-balancer rule doesn't apply with only one server). */
  applicable: boolean
  passed: boolean
  message: string
}

export interface ValidationReport {
  results: RuleResult[]
  categoryScores: Record<ScoreCategory, number>
  overallScore: number
  passed: boolean
}
