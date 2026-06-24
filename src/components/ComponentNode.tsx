import { Handle, Position, type NodeProps } from '@xyflow/react'
import { COMPONENT_BY_KIND } from '../data/components'
import type { ArchitectureNode } from '../store/useGraphStore'

// Larger invisible hit area so handles are usable with a finger, while the
// visible dot stays small. React Flow styles the ::before/dot; we expand the
// touchable box via width/height + a transparent background.
const handleStyle = {
  width: 26,
  height: 26,
  background: 'transparent',
  border: 'none',
}

export function ComponentNode({ data, selected }: NodeProps<ArchitectureNode>) {
  const def = COMPONENT_BY_KIND[data.kind]

  return (
    <div
      className={`node-enter min-w-[7rem] rounded-md border-2 px-4 py-3 text-center text-sm font-medium shadow-sm transition ${
        def?.accentClass ?? 'border-slate-300 bg-white'
      } ${selected ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
    >
      <Handle type="target" position={Position.Top} style={handleStyle}>
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500" />
      </Handle>
      {data.label}
      <Handle type="source" position={Position.Bottom} style={handleStyle}>
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500" />
      </Handle>
    </div>
  )
}
