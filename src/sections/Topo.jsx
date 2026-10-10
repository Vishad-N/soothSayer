import { useRef, useState } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import { STATES } from '../components/transformation/states.js'
import { useTransformationScroll } from '../components/transformation/useTransformationScroll.js'

// Pinned, scroll-scrubbed section: a particle network that resolves from noise into a
// workflow as the six stages play. Drawing lives in transformation/network.js and the
// scroll wiring in useTransformationScroll; this file is structure only.
export default function Topo() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const canvasRef = useRef(null)
  const stepsRef = useRef(null)
  const railRef = useRef(null)
  const barRef = useRef(null)
  const liveRef = useRef(null)
  // fixed at mount so the node count never changes mid-scroll
  const [count] = useState(() => (window.innerWidth < 760 ? 110 : 220))

  useTransformationScroll({ sectionRef, pinRef, canvasRef, stepsRef, railRef, barRef, liveRef, count })

  return (
    <section className="sec" id="topo" ref={sectionRef} aria-labelledby="h-t">
      <div className="stick" ref={pinRef}>
        <div className="topo-in wrap">
          <div className="topo-h">
            <span className="scrim" />
            <ParticleText as="p" className="eyebrow" text="Transformation" />
            <h2 id="h-t">
              From complexity <br />
              to <em>intelligence.</em>
            </h2>
          </div>
          <div className="cmid">
            <div className="nv-viz" aria-hidden="true">
              <span className="nv-quiet" />
              <canvas className="nv-canvas" ref={canvasRef} />
            </div>
            <div className="nv-steps" ref={stepsRef}>
              {STATES.map((s, i) => (
                <article className={i === 0 ? 'nv-step on' : 'nv-step'} key={s.id} aria-hidden={i !== 0} data-label={`${s.number} ${s.title}. ${s.body}`}>
                  <span className="mono">
                    {s.number} · {s.rail}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <span className="chip">{s.meta}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="rail-w" aria-hidden="true">
            <span className="rail-bar">
              <i ref={barRef} />
            </span>
            <div className="rail" ref={railRef}>
              {STATES.map((s, i) => (
                <span key={s.id} className={i === 0 ? 'on' : undefined}>
                  {s.rail}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="cs-live" ref={liveRef} aria-live="polite" />
      </div>
    </section>
  )
}
