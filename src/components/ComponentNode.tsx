import { Handle, Position, type NodeProps } from '@xyflow/react'
import { COMPONENT_BY_KIND } from '../data/components'
import type { ArchitectureNode } from '../store/useGraphStore'

export function ComponentNode({ data }: NodeProps<ArchitectureNode>) {
  const def = COMPONENT_BY_KIND[data.kind]

  return (
    <div
      className={`rounded-md border-2 px-4 py-2 text-sm font-medium shadow-sm ${def?.accentClass ?? 'border-slate-300 bg-white'}`}
    >
      <Handle type="target" position={Position.Top} />
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
