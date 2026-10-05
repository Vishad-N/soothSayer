import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { clamp, prefersReducedMotion } from '../lib/utils.js'

const STEPS = [
  { title: 'Vision', body: 'Where intelligence should change the business.' },
  { title: 'Data', body: 'What is available, trusted and ready.' },
  { title: 'Use cases', body: 'The highest-value problems, ranked.' },
  { title: 'Architecture', body: 'How the pieces fit your enterprise estate.' },
  { title: 'Governance', body: 'Controls, risk and accountability.' },
  { title: 'Enablement', body: 'People equipped to run and grow it.' },
]

// Connector curve from one card to the next: side-to-side when they sit on a row, else top-to-bottom.
function connector(A, B, box) {
  const ar = A.right - box.left
  const br = B.left - box.left
  const ay = A.top + A.height / 2 - box.top
  const by = B.top + B.height / 2 - box.top
  if (B.left > A.right - 20 && Math.abs(ay - by) < 200) {
    const mid = ar + (br - ar) / 2
    return `M${ar} ${ay} C ${mid} ${ay}, ${mid} ${by}, ${br} ${by}`
  }
  const ax = A.left + A.width / 2 - box.left
  const bx = B.left + B.width / 2 - box.left
  const a2 = A.bottom - box.top
  const b2 = B.top - box.top
  return `M${ax} ${a2} C ${ax} ${a2 + (b2 - a2) / 2 + 30}, ${bx} ${b2 - (b2 - a2) / 2 - 30}, ${bx} ${b2}`
}

// Dashed blueprint lines between cards, with solid strokes that draw in as you scroll.
export default function Strategy() {
  const gridRef = useRef(null)
  const strokeRefs = useRef([])
  const lengths = useRef([])
  const [geometry, setGeometry] = useState({ viewBox: undefined, paths: [] })

  const updateStrokes = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    const r = grid.getBoundingClientRect()
    const q = clamp((window.innerHeight * 0.8 - r.top) / (r.height + window.innerHeight * 0.2))
    const n = lengths.current.length
    strokeRefs.current.forEach((path, i) => {
      if (!path) return
      const k = clamp(q * (n + 1) - i)
      path.style.strokeDashoffset = prefersReducedMotion ? 0 : lengths.current[i] * (1 - k)
    })
  }, [])

  useEffect(() => {
    const build = () => {
      const grid = gridRef.current
      if (!grid) return
      const box = grid.getBoundingClientRect()
      const cards = [...grid.querySelectorAll('.scard')].map((c) => c.getBoundingClientRect())
      const paths = []
      for (let i = 0; i < cards.length - 1; i++) paths.push(connector(cards[i], cards[i + 1], box))
      setGeometry({ viewBox: `0 0 ${box.width} ${box.height}`, paths })
    }
    build()
    // Re-measure once fonts and reveal transitions have settled.
    const timer = setTimeout(build, 400)
    window.addEventListener('resize', build)
    window.addEventListener('load', build)
    window.addEventListener('scroll', updateStrokes, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', build)
      window.removeEventListener('load', build)
      window.removeEventListener('scroll', updateStrokes)
    }
  }, [updateStrokes])

  useLayoutEffect(() => {
    lengths.current = strokeRefs.current.slice(0, geometry.paths.length).map((p) => p.getTotalLength())
    strokeRefs.current.forEach((p, i) => {
      if (!p) return
      p.style.strokeDasharray = lengths.current[i]
    })
    updateStrokes()
  }, [geometry, updateStrokes])

  return (
    <section className="sec" id="strategy" aria-labelledby="h-s">
      <div className="wrap">
        <div className="str-h">
          <Reveal as="p" className="fig">
            FIG. 10 — STRATEGY → SYSTEM
          </Reveal>
          <Reveal as="h2" id="h-s">
            AI strategy that becomes <em>architecture.</em>
          </Reveal>
          <Reveal as="p" className="lead" style={{ margin: '0 auto' }}>
            Scroll to watch the blueprint harden into a working structure.
          </Reveal>
        </div>
        <div className="sg" ref={gridRef}>
          <svg viewBox={geometry.viewBox} aria-hidden="true">
            <defs>
              <linearGradient id="bg2" x1="0" x2="1">
                <stop offset="0" stopColor="#9AA8B7" />
                <stop offset="1" stopColor="#00D9FF" />
              </linearGradient>
            </defs>
            {geometry.paths.map((d, i) => (
              <path key={`bp${i}`} className="bp" d={d} />
            ))}
            {geometry.paths.map((d, i) => (
              <path key={`bs${i}`} className="bs" d={d} ref={(el) => (strokeRefs.current[i] = el)} />
            ))}
          </svg>
          {STEPS.map((step, i) => (
            <Reveal key={step.title} className={`card scard s${i + 1} hv`}>
              <span className="mono">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
