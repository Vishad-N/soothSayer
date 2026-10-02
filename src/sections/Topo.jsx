import { useEffect, useRef, useState } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import { sectionProgress } from '../lib/utils.js'

const STAGES = [
  { rail: 'RAW DATA', label: '01 · Raw data', body: 'Thousands of disconnected signals: noisy, tangled, easy to ignore.' },
  { rail: 'PATTERN', label: '02 · Pattern', body: 'Structure emerges. Related behaviour begins to line up.' },
  { rail: 'SIGNAL', label: '03 · Signal', body: 'One route stands out from the noise: the signal worth acting on.' },
  { rail: 'INTELLIGENCE', label: '04 · Intelligence', body: 'The whole system reorganizes around that signal.' },
  { rail: 'ACTION', label: '05 · Action', body: 'Intelligence flows into the workflows where decisions are made.' },
  { rail: 'IMPACT', label: '06 · Impact', body: 'Decisions turn into measurable business outcomes.' },
]

// Tall sticky section: scroll progress steps through the six stages.
export default function Topo() {
  const sectionRef = useRef(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const progress = sectionProgress(sectionRef.current)
      setStage(Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const current = STAGES[stage]

  return (
    <section className="sec" id="topo" ref={sectionRef} aria-labelledby="h-t">
      <div className="stick">
        <div className="topo-in wrap">
          <div className="topo-h">
            <span className="scrim" />
            <ParticleText as="p" className="eyebrow" text="Transformation" />
            <h2 id="h-t">
              From complexity <br />
              to <em>intelligence.</em>
            </h2>
          </div>
          <div className="topo-b">
            <div className="card stagecard" aria-live="polite">
              <span className="mono">{current.label}</span>
              <p style={{ marginTop: 6 }}>{current.body}</p>
            </div>
            <div className="rail" aria-label="From raw data to impact">
              {STAGES.map((s, i) => (
                <span key={s.rail} className={i === stage ? 'on' : undefined}>
                  {s.rail}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
