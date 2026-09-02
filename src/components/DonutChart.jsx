/** SVG donut matching Recharts Pie: startAngle=90, clockwise to -270. */
function point(cx, cy, r, angle) {
  const rad = (-angle * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

export function DonutChart({ segments, size = 140, innerRadius = 44, outerRadius = 62 }) {
  const cx = size / 2
  const cy = size / 2
  const active = segments.filter((s) => s.value > 0)
  const slices = active.length ? active : [{ value: 1, color: '#dde1ec' }]
  const total = slices.reduce((s, seg) => s + seg.value, 0) || 1
  const ring = outerRadius - innerRadius
  const mid = (outerRadius + innerRadius) / 2

  const parts = []
  let angle = 90
  slices.forEach((seg, i) => {
    const sweep = (seg.value / total) * 360
    const end = angle - sweep
    if (sweep >= 359.99) {
      parts.push(
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={mid}
          fill="none"
          stroke={seg.color || '#dde1ec'}
          strokeWidth={ring}
        />,
      )
    } else {
      const large = sweep > 180 ? 1 : 0
      const [x1, y1] = point(cx, cy, outerRadius, angle)
      const [x2, y2] = point(cx, cy, outerRadius, end)
      const [x3, y3] = point(cx, cy, innerRadius, end)
      const [x4, y4] = point(cx, cy, innerRadius, angle)
      parts.push(
        <path
          key={i}
          d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${x4} ${y4} Z`}
          fill={seg.color || '#dde1ec'}
        />,
      )
    }
    angle = end
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {parts}
    </svg>
  )
}
