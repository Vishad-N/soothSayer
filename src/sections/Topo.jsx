import { useRef, useState } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import CardStage from '../components/transformation/CardStage.jsx'
import { DESKTOP_FRAGMENTS, MOBILE_FRAGMENTS } from '../components/transformation/fragments.js'
import { STATES } from '../components/transformation/states.js'
import { useTransformationScroll } from '../components/transformation/useTransformationScroll.js'

// Pinned, scroll-scrubbed section: one card that inflates, bursts and is rebuilt as the
// next state. All motion lives in useTransformationScroll; this file is structure only.
export default function Topo() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const stageRef = useRef(null)
  const railRef = useRef(null)
  const liveRef = useRef(null)
  // fixed at mount so shard count never changes mid-scroll
  const [fragments] = useState(() => (window.innerWidth < 760 ? MOBILE_FRAGMENTS : DESKTOP_FRAGMENTS))

  useTransformationScroll({ sectionRef, pinRef, stageRef, railRef, liveRef, fragments })

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
          {/* the card anchors to the free space between heading and pills, so it never meets the heading */}
          <div className="cmid">
            <CardStage states={STATES} fragments={fragments} stageRef={stageRef} />
          </div>
          <div className="rail" ref={railRef} aria-hidden="true">
            {STATES.map((s, i) => (
              <span key={s.id} className={i === 0 ? 'on' : undefined}>
                {s.rail}
              </span>
            ))}
          </div>
        </div>
        <p className="cs-live" ref={liveRef} aria-live="polite" />
      </div>
    </section>
  )
}
