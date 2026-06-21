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
}

export type ConnectionKind = 'sync' | 'async'

export interface ArchitectureNodeData {
  kind: ComponentKind
  label: string
  [key: string]: unknown
}
