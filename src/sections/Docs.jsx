import { useEffect, useRef, useState } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'
import { cx, createRng, prefersReducedMotion } from '../lib/utils.js'

const STAGES = ['INGEST', 'CLASSIFY', 'EXTRACT', 'VALIDATE', 'INTEGRATE']
const CYCLE_MS = 2600

// Scatter 20 "document" plates around the edges, keeping the centre ellipse clear for the copy.
function buildPlates() {
  const rnd = createRng(77)
  const plates = []
  let tries = 0
  while (plates.length < 20 && tries++ < 400) {
    const x = rnd() * 1600
    const y = rnd() * 900
    const inCentre = Math.pow((x - 800) / 620, 2) + Math.pow((y - 450) / 330, 2) < 1
    if (inCentre) continue
    plates.push({ x, y, rotate: (rnd() - 0.5) * 50, scale: 0.8 + rnd() * 0.9, group: plates.length % STAGES.length })
  }
  return plates
}
const PLATES = buildPlates()
const EXTRACTION_LINES = Array.from({ length: 4 }, (_, i) => {
  const y0 = 120 + i * 200
  return `M-20 ${y0} C 400 ${y0 - 120}, 700 ${y0 + 160}, 1000 ${y0 + 30} S 1500 ${y0 - 80}, 1640 ${y0 + 60}`
})

export default function Docs() {
  const [active, setActive] = useState(0)
  // Auto-cycling stops for good once the visitor interacts.
  const userInteracted = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => {
      if (!userInteracted.current) setActive((c) => (c + 1) % STAGES.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  const choose = (i) => {
    userInteracted.current = true
    setActive(i)
  }

  return (
    <section className="sec" id="docs" aria-labelledby="h-d">
      <div className="dec doc-art" aria-hidden="true">
        <svg id="docart" data-s={active} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          {PLATES.map((p, i) => (
            <g
              key={i}
              data-g={p.group}
              transform={`translate(${p.x} ${p.y}) rotate(${p.rotate}) scale(${p.scale}) skewX(-12)`}
            >
              <path className="pl" data-g={p.group} d="M0 0 C 60 -16, 140 16, 200 0 L 190 120 C 130 136, 70 104, 8 124 Z" />
              <path
                className="pl-l"
                d="M24 28 C 70 22, 120 38, 170 26 M26 52 C 70 46, 110 60, 150 52 M28 76 C 60 72, 100 84, 130 78"
              />
              <path className="pl-h" d="M30 100 C 70 94, 110 106, 160 98" />
            </g>
          ))}
          {EXTRACTION_LINES.map((d, i) => (
            <path key={i} className="ext" d={d} />
          ))}
        </svg>
      </div>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="doc-c">
          <span className="scrim" />
          <ParticleText as="p" className="eyebrow" reveal text="Intelligent document processing" />
          <Reveal as="h2" id="h-d">
            Documents in. <em>Insights</em> out.
          </Reveal>
          <Reveal as="p" className="lead">
            Contracts, forms, invoices and reports become structured, validated data your systems can use.
          </Reveal>
        </div>
        <Reveal className="pls" role="group" aria-label="Document processing stages">
          {STAGES.map((stage, i) => (
            <button
              key={stage}
              type="button"
              className={cx('card', i === active && 'on')}
              onClick={() => choose(i)}
              onMouseEnter={() => choose(i)}
              onFocus={() => choose(i)}
            >
              <small>0{i + 1}</small>
              {stage}
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
