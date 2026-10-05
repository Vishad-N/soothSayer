import { useEffect, useRef } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'
import { createRng, prefersReducedMotion } from '../lib/utils.js'

const RIPPLE_MS = 1200

const CONTOURS = Array.from({ length: 14 }, (_, n) => {
  const i = n + 1
  const r = i * 15
  return { rx: r * 1.2, ry: r * 0.8, rotate: -20 + i * 3, opacity: Math.max(0.12, 0.7 - i * 0.04) }
})
const DOTS = (() => {
  const rnd = createRng(5)
  return Array.from({ length: 70 }, () => ({ cx: 60 + rnd() * 300, cy: 50 + rnd() * 300, r: rnd() * 1.6 + 0.5, opacity: 0.2 + rnd() * 0.5 }))
})()

// Featured topic disc; hovering sends a one-shot displacement ripple through the artwork.
function TopicDisc() {
  const discRef = useRef(null)
  const turbulenceRef = useRef(null)
  const displacementRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const disc = discRef.current
    let raf = 0
    const onEnter = () => {
      cancelAnimationFrame(raf)
      const start = performance.now()
      const step = (now) => {
        const k = (now - start) / RIPPLE_MS
        if (k >= 1) {
          displacementRef.current.setAttribute('scale', 0)
          return
        }
        displacementRef.current.setAttribute('scale', (22 * Math.sin(k * Math.PI)).toFixed(1))
        turbulenceRef.current.setAttribute('baseFrequency', `${0.012 + k * 0.01} ${0.016 + k * 0.008}`)
        raf = requestAnimationFrame(step)
      }
      step(start)
    }
    disc.addEventListener('mouseenter', onEnter)
    return () => {
      disc.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="disc" ref={discRef}>
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="ig" cx=".5" cy=".5" r=".65">
            <stop offset="0" stopColor="#121A24" />
            <stop offset="1" stopColor="#050B14" />
          </radialGradient>
          <filter id="rip" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency=".012 .016"
              numOctaves="2"
              seed="3"
              result="n"
            />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="n" scale="0" />
          </filter>
        </defs>
        <rect width="400" height="400" fill="url(#ig)" />
        <g fill="none" stroke="rgba(244,248,252,.28)" strokeWidth="1" filter="url(#rip)">
          {CONTOURS.map((c, i) => (
            <ellipse
              key={i}
              cx="220"
              cy="200"
              rx={c.rx}
              ry={c.ry}
              transform={`rotate(${c.rotate} 220 200)`}
              opacity={c.opacity}
            />
          ))}
          {DOTS.map((d, i) => (
            <circle key={`d${i}`} cx={d.cx} cy={d.cy} r={d.r} fill="#F4F8FC" stroke="none" opacity={d.opacity} />
          ))}
          <path d="M-10 320 C 100 260, 160 330, 250 220 S 360 120, 420 90" stroke="#00D9FF" strokeWidth="1.6" opacity=".9" />
          <circle cx="270" cy="170" r="4" fill="#00D9FF" />
        </g>
      </svg>
    </div>
  )
}

export default function Insights() {
  return (
    <section className="sec" id="ins" aria-labelledby="h-n">
      <div className="wrap">
        <div className="ins-h">
          <ParticleText as="p" className="eyebrow" reveal text="Insights" />
          <Reveal as="h2" id="h-n">
            Where <em>knowledge</em> compounds.
          </Reveal>
        </div>
        <div className="ing">
          <Reveal as="a" href="#" className="circ" aria-label="Topic: Enterprise AI, from pilot to production">
            <TopicDisc />
            <div className="ct">
              <span className="mono" style={{ color: 'var(--ice)' }}>
                Topic · Enterprise AI
              </span>
              <h3>From pilot to production</h3>
              <p>What it takes to move enterprise AI into the way the business runs.</p>
            </div>
          </Reveal>
          <Reveal as="a" href="#" className="card ia hv" delay=".1s">
            <span className="mono">Topic · Agentic AI</span>
            <h3>Systems that act, within guardrails</h3>
            <p>
              How agents plan, use tools and stay accountable. <i className="arr">→</i>
            </p>
          </Reveal>
          <Reveal as="a" href="#" className="card ib hv" delay=".2s">
            <span className="mono">Topic · Predictive analytics</span>
            <h3>Forecasts that pay back</h3>
            <p>
              Turning prediction into decisions. <i className="arr">→</i>
            </p>
          </Reveal>
          <a href="#" className="fp">
            AI strategy · Responsible AI <i style={{ fontStyle: 'normal', color: 'var(--tx)' }}>→</i>
          </a>
        </div>
      </div>
    </section>
  )
}
