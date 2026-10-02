import { useEffect, useState } from 'react'
import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'
import { cx } from '../lib/utils.js'

const INDUSTRIES = [
  ['MANUFACTURING', 'Forecasting, optimization and computer vision applied to plants, parts and quality.'],
  ['HEALTHCARE', 'Pattern recognition and document intelligence across clinical and operational data.'],
  ['RETAIL', 'Demand prediction and optimization from shelf to checkout.'],
  ['SUPPLY CHAIN', 'Forecasting to fulfillment: plan, procure and move with fewer surprises.'],
  ['INSURANCE', 'Document processing and predictive models for claims and risk.'],
  ['UTILITIES', 'IoT and big-data analytics that anticipate asset and demand behaviour.'],
  ['AUTOMOTIVE', 'Predictive analytics and computer vision across design, build and service.'],
]
const RADII = [33, 35, 31, 35, 32, 36, 32]
const BOWS = [0.14, -0.12, 0.16, -0.14, 0.12, -0.16, 0.15]
const MOBILE_MAX = 760

// Positions (in % of the square constellation) for each pill and its connector curve.
function layout(active) {
  return INDUSTRIES.map((_, i) => {
    const a = ((-90 + (i * 360) / INDUSTRIES.length) * Math.PI) / 180
    let r = RADII[i]
    if (active >= 0) r *= i === active ? 0.92 : 1.03
    const x = 50 + r * Math.cos(a)
    const y = 50 + r * Math.sin(a)
    const sx = 50 + 13.5 * Math.cos(a)
    const sy = 50 + 13.5 * Math.sin(a)
    const ex = 50 + (r - 5) * Math.cos(a)
    const ey = 50 + (r - 5) * Math.sin(a)
    const qx = (sx + ex) / 2 - Math.sin(a) * BOWS[i] * r * 1.2
    const qy = (sy + ey) / 2 + Math.cos(a) * BOWS[i] * r * 1.2
    return { x, y, d: `M${sx} ${sy} Q${qx} ${qy} ${ex} ${ey}` }
  })
}

// Where the detail card and its dotted leader sit for the selected pill.
function cardPlacement(index, pos) {
  const { x, y } = pos[index]
  const right = x >= 50
  const top = y < 50 || index === 0
  const cxp = right ? 86 : 14
  const cyp = top ? 10 : 90
  return {
    style: { left: `${right ? 73 : 1}%`, top: `${top ? 1 : 83}%` },
    leader: `M${x} ${y} Q${(x + cxp) / 2} ${(y + cyp) / 2} ${cxp} ${top ? 15 : 85}`,
  }
}

export default function Industries() {
  const [active, setActive] = useState(-1)
  // Last selected industry; the card keeps its content while fading out.
  const [shown, setShown] = useState(-1)
  const [mobile, setMobile] = useState(() => window.innerWidth <= MOBILE_MAX)

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= MOBILE_MAX)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const select = (i) => {
    setActive(i)
    if (i >= 0) setShown(i)
  }

  const pos = layout(active)
  const placement = shown >= 0 ? cardPlacement(shown, layout(shown)) : null

  return (
    <section className="sec" id="ind" aria-labelledby="h-ind">
      <div className="wrap">
        <div className="ind-h">
          <span className="scrim" />
          <ParticleText as="p" className="eyebrow" reveal text="Industries" />
          <Reveal as="h2" id="h-ind">
            One <em>intelligence.</em> Seven industries.
          </Reveal>
        </div>
        <Reveal className={cx('con', active >= 0 && 'has')}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {pos.map((p, i) => (
              <path key={i} className={cx('cpth', i === active && 'on')} d={p.d} />
            ))}
            <path
              fill="none"
              stroke="#00D9FF"
              strokeWidth=".3"
              strokeDasharray="1 1"
              d={placement?.leader}
              opacity={active >= 0 ? 1 : 0}
            />
          </svg>
          <div className="core">INTELLI{'­'}GENCE</div>
          {INDUSTRIES.map(([name], i) => (
            <button
              key={name}
              type="button"
              className={cx('np', i === active && 'on')}
              style={mobile ? undefined : { left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
              onMouseLeave={() => select(-1)}
              onBlur={() => select(-1)}
            >
              {name}
            </button>
          ))}
          <div className={cx('card icard', active >= 0 && 'show')} role="status" style={placement?.style}>
            {shown >= 0 && (
              <>
                <span className="mono" style={{ color: 'var(--cyan)' }}>
                  0{shown + 1} · {INDUSTRIES[shown][0]}
                </span>
                <h3>Intelligence in {INDUSTRIES[shown][0].toLowerCase()}</h3>
                <p>{INDUSTRIES[shown][1]}</p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
