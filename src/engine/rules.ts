import { getIncomers, getOutgoers, type Edge } from '@xyflow/react'
import { COMPONENT_BY_KIND } from '../data/components'
import type { ArchitectureNode } from '../store/useGraphStore'
import type { ComponentKind, RuleResult, Scenario, ScoreCategory } from '../types'

export interface RuleContext {
  nodes: ArchitectureNode[]
  edges: Edge[]
  scenario: Scenario
}

type RuleOutcome = Omit<RuleResult, 'ruleId' | 'label' | 'category'>

export interface Rule {
  id: string
  label: string
  category: ScoreCategory
  evaluate: (ctx: RuleContext) => RuleOutcome
}

function byKind(nodes: ArchitectureNode[], kind: ComponentKind) {
  return nodes.filter((n) => n.data.kind === kind)
}

export const RULES: Rule[] = [
  {
    id: 'client-connected',
    label: 'Client is connected to the system',
    category: 'simplicity',
    evaluate: ({ nodes, edges }) => {
      const clients = byKind(nodes, 'client')
      if (clients.length === 0) {
        return {
          applicable: true,
          passed: false,
          message: 'No client node found — add one so the design has an entry point.',
        }
      }
      const connected = clients.some((c) => getOutgoers(c, nodes, edges).length > 0)
      return connected
        ? { applicable: true, passed: true, message: 'Client is wired into the system.' }
        : { applicable: true, passed: false, message: 'Client node is not connected to anything.' }
    },
  },
  {
    id: 'no-orphan-nodes',
    label: 'No disconnected components',
    category: 'simplicity',
    evaluate: ({ nodes, edges }) => {
      const orphans = nodes.filter(
        (n) => getIncomers(n, nodes, edges).length === 0 && getOutgoers(n, nodes, edges).length === 0,
      )
      return orphans.length === 0
        ? { applicable: true, passed: true, message: 'Every component is connected.' }
        : {
            applicable: true,
            passed: false,
            message: `${orphans.length} component(s) aren't connected to anything: ${orphans
              .map((o) => o.data.label)
              .join(', ')}.`,
          }
    },
  },
  {
    id: 'no-exposed-database',
    label: 'Databases are not exposed directly to clients',
    category: 'reliability',
    evaluate: ({ nodes, edges }) => {
      const databases = nodes.filter(
        (n) => n.data.kind === 'sql_database' || n.data.kind === 'nosql_database',
      )
      const exposed = databases.filter((db) =>
        getIncomers(db, nodes, edges).some((src) => src.data.kind === 'client'),
      )
      return exposed.length === 0
        ? { applicable: true, passed: true, message: 'No database is directly exposed to a client.' }
        : {
            applicable: true,
            passed: false,
            message: `${exposed
              .map((d) => d.data.label)
              .join(', ')} is directly reachable from a client — put a server in front of it.`,
          }
    },
  },
  {
    id: 'load-balancer-for-multiple-servers',
    label: 'Multiple servers sit behind a load balancer',
    category: 'scalability',
    evaluate: ({ nodes }) => {
      const servers = byKind(nodes, 'server')
      if (servers.length <= 1) {
        return {
          applicable: false,
          passed: true,
          message: 'Only one server — load balancing not required yet.',
        }
      }
      const hasLoadBalancer = byKind(nodes, 'load_balancer').length > 0
      return hasLoadBalancer
        ? { applicable: true, passed: true, message: 'Multiple servers are fronted by a load balancer.' }
        : {
            applicable: true,
            passed: false,
            message: `${servers.length} servers but no load balancer — traffic has no way to be distributed.`,
          }
    },
  },
  {
    id: 'redundant-servers-for-high-availability',
    label: 'Compute is redundant for the required uptime',
    category: 'reliability',
    evaluate: ({ nodes, scenario }) => {
      if (scenario.requirements.uptimeSlaPercent < 99.9) {
        return {
          applicable: false,
          passed: true,
          message: 'Uptime requirement is low enough that a single server is acceptable.',
        }
      }
      const servers = byKind(nodes, 'server')
      return servers.length >= 2
        ? { applicable: true, passed: true, message: 'Multiple servers protect against a single point of failure.' }
        : {
            applicable: true,
            passed: false,
            message: `Uptime SLA of ${scenario.requirements.uptimeSlaPercent}% needs redundant servers — a single server is a single point of failure.`,
          }
    },
  },
  {
    id: 'cache-for-read-heavy-traffic',
    label: 'Hot reads are cached',
    category: 'scalability',
    evaluate: ({ nodes, edges, scenario }) => {
      const isReadHeavy = scenario.requirements.readsPerSecond > scenario.requirements.writesPerSecond * 5
      if (!isReadHeavy) {
        return {
          applicable: false,
          passed: true,
          message: 'Traffic is not read-heavy enough to require a cache.',
        }
      }
      const caches = byKind(nodes, 'cache')
      const wired = caches.some(
        (c) => getIncomers(c, nodes, edges).length > 0 && getOutgoers(c, nodes, edges).length > 0,
      )
      return wired
        ? { applicable: true, passed: true, message: 'A cache is wired in front of the hot read path.' }
        : {
            applicable: true,
            passed: false,
            message: `Read traffic (${scenario.requirements.readsPerSecond}/s) far exceeds writes — add a cache so reads don't hammer the database.`,
          }
    },
  },
  {
    id: 'queue-has-consumer',
    label: 'Queues have a consumer',
    category: 'reliability',
    evaluate: ({ nodes, edges }) => {
      const queues = byKind(nodes, 'queue')
      if (queues.length === 0) {
        return { applicable: false, passed: true, message: 'No queue in this design.' }
      }
      const unconsumed = queues.filter((q) => getOutgoers(q, nodes, edges).length === 0)
      return unconsumed.length === 0
        ? { applicable: true, passed: true, message: 'Every queue has a consumer.' }
        : {
            applicable: true,
            passed: false,
            message: `${unconsumed
              .map((q) => q.data.label)
              .join(', ')} has no consumer — messages would pile up forever.`,
          }
    },
  },
  {
    id: 'within-budget',
    label: 'Design stays within budget',
    category: 'cost',
    evaluate: ({ nodes, scenario }) => {
      const monthlyCost = nodes.reduce(
        (sum, n) => sum + (COMPONENT_BY_KIND[n.data.kind]?.monthlyCost ?? 0),
        0,
      )
      return monthlyCost <= scenario.requirements.budgetPerMonth
        ? {
            applicable: true,
            passed: true,
            message: `Estimated cost $${monthlyCost}/mo is within the $${scenario.requirements.budgetPerMonth}/mo budget.`,
          }
        : {
            applicable: true,
            passed: false,
            message: `Estimated cost $${monthlyCost}/mo exceeds the $${scenario.requirements.budgetPerMonth}/mo budget.`,
          }
    },
  },
]
