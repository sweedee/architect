import type { ComponentDefinition } from '../types'

export const COMPONENT_CATALOG: ComponentDefinition[] = [
  {
    kind: 'client',
    label: 'Client',
    description: 'Browser, mobile app, or other caller that originates requests.',
    accentClass: 'border-slate-400 bg-slate-50',
  },
  {
    kind: 'load_balancer',
    label: 'Load Balancer',
    description: 'Distributes incoming traffic across multiple servers.',
    accentClass: 'border-amber-400 bg-amber-50',
  },
  {
    kind: 'server',
    label: 'Server',
    description: 'Web or application server that handles business logic.',
    accentClass: 'border-blue-400 bg-blue-50',
  },
  {
    kind: 'sql_database',
    label: 'SQL Database',
    description: 'Relational database with strong consistency guarantees.',
    accentClass: 'border-emerald-400 bg-emerald-50',
  },
  {
    kind: 'nosql_database',
    label: 'NoSQL Database',
    description: 'Document/key-value store optimized for scale and flexibility.',
    accentClass: 'border-teal-400 bg-teal-50',
  },
  {
    kind: 'cache',
    label: 'Cache',
    description: 'In-memory store (Redis-style) for low-latency reads.',
    accentClass: 'border-rose-400 bg-rose-50',
  },
  {
    kind: 'queue',
    label: 'Message Queue',
    description: 'Buffers work asynchronously between producers and consumers.',
    accentClass: 'border-violet-400 bg-violet-50',
  },
  {
    kind: 'cdn',
    label: 'CDN',
    description: 'Edge network that caches static content close to users.',
    accentClass: 'border-cyan-400 bg-cyan-50',
  },
  {
    kind: 'object_storage',
    label: 'Object Storage',
    description: 'Durable blob storage for files, media, and backups.',
    accentClass: 'border-orange-400 bg-orange-50',
  },
  {
    kind: 'third_party_api',
    label: 'Third-Party API',
    description: 'External service the system integrates with.',
    accentClass: 'border-fuchsia-400 bg-fuchsia-50',
  },
]

export const COMPONENT_BY_KIND = Object.fromEntries(
  COMPONENT_CATALOG.map((c) => [c.kind, c]),
) as Record<string, ComponentDefinition>
