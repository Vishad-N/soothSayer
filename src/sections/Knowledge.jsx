import { useEffect, useRef, useState } from 'react'
import { easeInOut, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import ParticleText from '../components/ParticleText.jsx'
import { CARDS, LAYOUTS, linkPath } from '../components/knowledge/data.js'
import '../styles/knowledge.css'

// Scroll beats, as fractions of the section's scroll progress:
//   0 – .10  knowledge   cards rest, separate
//   .10 – .45 connection cards travel into their clusters
//   .45 – .66 context    links inside each cluster draw in
//   .66 – .90 compounding core cards pull together and gain emphasis, cross-cluster links draw in
const BEATS = [0, 0.1, 0.45, 0.66, 0.9, 1]

function layoutMode() {
  const w = window.innerWidth
  return w < 760 ? 'phone' : w < 1100 ? 'tablet' : 'desktop'
}

function useLayoutMode() {
  const [mode, setMode] = useState(layoutMode)
  useEffect(() => {
    const onResize = () => setMode(layoutMode())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mode
}

function Heading() {
  return (
    <div className="kn-head">
      <span className="scrim" aria-hidden="true" />
      <ParticleText as="p" className="eyebrow" reveal text="The intelligence layer" />
      <h2 id="h-k">
        Where
        <br />
        <em>Knowledge</em>
        <br />
        compounds.
      </h2>
      <p className="lead">Every engagement adds context. Every pattern strengthens the next decision.</p>
    </div>
  )
}

function KnowledgeCard({ card, index, layout, progress }) {
  const { c0, c2, push, wf = 1 } = layout.pos[card.id]
  // each card starts a beat later than the one before it, so they never all move at once
  const lag = (index % 4) * 0.015
  const times = [0, BEATS[1] + lag, BEATS[2] + lag, BEATS[3], BEATS[4], 1]
  const c1 = push ? [c2[0] + push[0], c2[1] + push[1]] : c2

  const ease = easeInOut
  const xf = useTransform(progress, times, [c0[0], c0[0], c1[0], c1[0], c2[0], c2[0]], { ease })
  const yf = useTransform(progress, times, [c0[1], c0[1], c1[1], c1[1], c2[1], c2[1]], { ease })
  const x = useTransform(xf, (v) => `${(v * 100).toFixed(3)}cqw`)
  const y = useTransform(yf, (v) => `${(v * 100).toFixed(3)}cqh`)
  const scale = useTransform(progress, [0, BEATS[3], BEATS[4]], [0.93, 1, card.core ? 1.05 : 1])
  const opacity = useTransform(progress, [0, 0.08], [0.6, 1])
  const ring = useTransform(progress, [BEATS[3], BEATS[4]], [0, card.core ? 1 : 0])

  return (
    <motion.article className="kn-card" style={{ x, y, scale, opacity, '--wf': wf, zIndex: card.core ? 2 : 1 }}>
      <div className="kn-in">
        <motion.span className="kn-ring" style={{ opacity: ring }} aria-hidden="true" />
        <span className="mono">{card.label}</span>
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
      </div>
    </motion.article>
  )
}

function Link({ d, progress, range, tone }) {
  const pathLength = useTransform(progress, range, [0, 1])
  const opacity = useTransform(progress, [range[0], range[0] + 0.03], [0, 1])
  return (
    <motion.path
      d={d}
      pathLength={1}
      style={{ pathLength, opacity }}
      className={`kn-link ${tone}`}
    />
  )
}

function Scene({ mode, reduced }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const phone = mode === 'phone'
  const layout = LAYOUTS[mode]

  const { scrollYProgress } = useScroll({
    target: phone ? stageRef : sectionRef,
    offset: phone ? ['start 0.85', 'end 0.55'] : ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const done = useMotionValue(1)
  // reduced motion shows the finished composition and skips all travel
  const progress = reduced ? done : smooth

  const stage = (
    <div className={`kn-stage ${mode}`} ref={stageRef}>
      {!phone && <Heading />}
      <svg className="kn-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {layout.intra.map(([a, b]) => (
          <Link key={a + b} d={linkPath(layout, a, b)} progress={progress} range={[BEATS[2], BEATS[3]]} tone="intra" />
        ))}
        {layout.cross.map(([a, b]) => (
          <Link key={a + b} d={linkPath(layout, a, b, 0.18)} progress={progress} range={[BEATS[3], BEATS[4]]} tone="cross" />
        ))}
      </svg>
      {CARDS.filter((c) => layout.pos[c.id]).map((card, i) => (
        <KnowledgeCard key={card.id} card={card} index={i} layout={layout} progress={progress} />
      ))}
    </div>
  )

  return (
    <section
      className={`sec kn ${mode}${reduced ? ' still' : ''}`}
      id="knowledge"
      ref={sectionRef}
      aria-labelledby="h-k"
    >
      {phone ? (
        <div className="wrap">
          <Heading />
          {stage}
        </div>
      ) : (
        <div className="kn-pin">{stage}</div>
      )}
    </section>
  )
}

export default function Knowledge() {
  const mode = useLayoutMode()
  const reduced = useReducedMotion()
  // remount per layout so each card's keyframes are rebuilt from that layout's positions
  return <Scene key={`${mode}-${reduced}`} mode={mode} reduced={!!reduced} />
}
