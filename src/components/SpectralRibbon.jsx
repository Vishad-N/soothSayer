import { useId } from 'react'
import { prefersReducedMotion } from '../lib/utils.js'

const STRANDS = Array.from({ length: 9 }, (_, i) => {
  const d = (i - 4) * 7
  return {
    d: `M-20 ${80 + d} C 400 ${10 + d * 2}, 800 ${150 + d * 1.4}, 1200 ${70 + d} S 1560 ${40 + d}, 1640 ${60 + d}`,
    centre: i === 4,
    dashed: i % 2 === 0,
    duration: 8 + i,
  }
})

// Decorative divider between sections.
export default function SpectralRibbon() {
  // useId output contains characters that are awkward inside url(#…), so strip them.
  const gradientId = `spg${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <div className="spec" aria-hidden="true">
      <svg viewBox="0 0 1600 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1">
            <stop offset="0" stopColor="#9AA8B7" stopOpacity=".6" />
            <stop offset=".5" stopColor="#00D9FF" stopOpacity=".9" />
            <stop offset="1" stopColor="#F4F8FC" stopOpacity=".2" />
          </linearGradient>
        </defs>
        {STRANDS.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={s.centre ? 2 : 1}
            opacity={s.centre ? 0.9 : 0.35}
            vectorEffect="non-scaling-stroke"
            strokeDasharray={s.dashed ? '6 10' : undefined}
            style={prefersReducedMotion ? undefined : { animation: `dash ${s.duration}s linear infinite` }}
          />
        ))}
      </svg>
    </div>
  )
}
