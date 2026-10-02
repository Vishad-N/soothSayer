import { useEffect, useRef, useState } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'
import { cx, prefersReducedMotion } from '../lib/utils.js'

const DIMENSIONS = ['Data', 'Architecture', 'Responsibility', 'Workflow', 'Integration', 'Nexus']
// [rx, ry, rotation°, node angle°] per orbit
const ORBITS = [
  [250, 238, -14, 200],
  [286, 262, 18, 320],
  [322, 296, -40, 70],
  [358, 334, 34, 150],
  [394, 364, -8, 250],
  [430, 396, 52, 20],
]
const CYCLE_MS = 3200

const PRINCIPLES = [
  { key: 'r1', label: 'By design', title: 'Built-in oversight', body: 'Responsibility is shaped in from the first architecture decision.' },
  { key: 'r2', label: 'In practice', title: 'Traceable decisions', body: 'Systems you can inspect, explain and improve.' },
  { key: 'r3', label: 'At scale', title: 'Fits your controls', body: 'Integrated with the governance your enterprise already runs.' },
]

function Eclipse({ active }) {
  return (
    <svg
      viewBox="0 0 800 800"
      role="img"
      aria-label="Dark eclipse labelled Responsible Intelligence, surrounded by six orbits: data, architecture, responsibility, workflow, integration and nexus"
    >
      <defs>
        <radialGradient id="hg">
          <stop offset=".72" stopColor="#00D9FF" stopOpacity="0" />
          <stop offset=".9" stopColor="#00D9FF" stopOpacity=".2" />
          <stop offset="1" stopColor="#00D9FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="400" cy="400" r="260" fill="url(#hg)" />
      {ORBITS.map(([rx, ry, rot, nodeDeg], i) => {
        const a = (nodeDeg * Math.PI) / 180
        const x = 400 + rx * Math.cos(a)
        const y = 400 + ry * Math.sin(a)
        return (
          <g key={i} transform={`rotate(${rot} 400 400)`}>
            <ellipse
              className={cx('orbit', i === active && 'on')}
              cx="400"
              cy="400"
              rx={rx}
              ry={ry}
              strokeDasharray={i % 2 ? '3 8' : undefined}
            />
            <circle cx={x} cy={y} r="7" fill="#050B14" stroke="#1677FF" strokeWidth="1.3" />
            <circle cx={x} cy={y} r="2.6" fill="#00D9FF" />
          </g>
        )
      })}
      <circle cx="400" cy="400" r="190" fill="#02050A" />
      <circle cx="400" cy="400" r="190" fill="none" stroke="#00D9FF" strokeWidth="1.3" opacity=".85" />
      <circle cx="400" cy="400" r="197" fill="none" stroke="#00D9FF" strokeWidth=".5" opacity=".4" />
      {[
        ['RESPONSIBLE', 388],
        ['INTELLIGENCE', 424],
      ].map(([word, y]) => (
        <text
          key={word}
          x="400"
          y={y}
          textAnchor="middle"
          fontFamily="Sora, sans-serif"
          fontWeight="600"
          fontSize={word.length > 11 ? 27 : 30}
          letterSpacing="3"
          fill="#F4F8FC"
        >
          {word}
        </text>
      ))}
    </svg>
  )
}

export default function Responsible() {
  const [active, setActive] = useState(0)
  const chipRefs = useRef([])

  // Auto-advance, pausing while any chip is hovered or focused.
  useEffect(() => {
    if (prefersReducedMotion) return
    let tick = 0
    const id = setInterval(() => {
      if (!chipRefs.current.some((c) => c?.matches(':hover,:focus'))) {
        tick = (tick + 1) % DIMENSIONS.length
        setActive(tick)
      }
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="sec" id="resp" aria-labelledby="h-r">
      <div className="wrap">
        <div className="resp-h">
          <ParticleText as="p" className="eyebrow" reveal text="Responsible AI" />
          <Reveal as="h2" id="h-r" style={{ maxWidth: 900, margin: '0 auto 10px' }}>
            Intelligence you can <em>control.</em>
          </Reveal>
        </div>
        <div className="eclw">
          <Reveal className="ecl">
            <Eclipse active={active} />
          </Reveal>
          <div className="rcs">
            {PRINCIPLES.map((p) => (
              <div key={p.key} className={`card rc ${p.key} hv`}>
                <span className="mono">{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="chs" role="group" aria-label="Responsible AI dimensions">
          {DIMENSIONS.map((name, i) => (
            <button
              key={name}
              type="button"
              ref={(el) => (chipRefs.current[i] = el)}
              className={i === active ? 'on' : undefined}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
