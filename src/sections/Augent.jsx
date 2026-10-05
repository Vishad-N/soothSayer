import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'
import { prefersReducedMotion } from '../lib/utils.js'

const RINGS = {
  rx: [285, 226, 168, 112, 60],
  ry: [280, 222, 164, 108, 58],
  cx: [296, 306, 316, 326, 336],
  cy: [300, 297, 294, 291, 288],
  labels: ['KNOWLEDGE', 'RETRIEVE', 'REASON', 'VALIDATE', 'ACT'],
}
const OUTER = 0
const INNER = RINGS.rx.length - 1
const LABEL_ANGLE = (-38 * Math.PI) / 180

const RAILS = Array.from({ length: 18 }, (_, i) => {
  const a = (i * Math.PI) / 9
  const x1 = RINGS.cx[OUTER] + RINGS.rx[OUTER] * Math.cos(a)
  const y1 = RINGS.cy[OUTER] + RINGS.ry[OUTER] * Math.sin(a)
  const x2 = RINGS.cx[INNER] + RINGS.rx[INNER] * Math.cos(a)
  const y2 = RINGS.cy[INNER] + RINGS.ry[INNER] * Math.sin(a)
  return `M${x1} ${y1}L${x2} ${y2}`
})

const FEATURES = [
  { key: 'k1', label: 'Outer ring', title: 'Knowledge', body: 'Grounded in your content.' },
  { key: 'k2', label: 'Inner logic', title: 'Reason', body: 'Multi-step, checked work.' },
  { key: 'k3', label: 'In the flow', title: 'Workflow', body: 'Built into how teams work.' },
  { key: 'k4', label: 'The core', title: 'Action', body: 'Decisions that move.' },
]

function Tunnel() {
  // Child order matters: the ring pulse delays in CSS use .rg:nth-child().
  return (
    <svg viewBox="0 0 600 600">
      <defs>
        <radialGradient id="tc">
          <stop offset="0" stopColor="#E8FBFF" />
          <stop offset=".3" stopColor="#00D9FF" />
          <stop offset="1" stopColor="#00D9FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="rgba(244,248,252,.14)" strokeWidth=".8" fill="none">
        {RAILS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {RINGS.labels.map((label, i) => {
        const tx = RINGS.cx[i] + RINGS.rx[i] * Math.cos(LABEL_ANGLE)
        const ty = RINGS.cy[i] + RINGS.ry[i] * Math.sin(LABEL_ANGLE)
        const ellipse = { cx: RINGS.cx[i], cy: RINGS.cy[i], rx: RINGS.rx[i], ry: RINGS.ry[i] }
        return (
          <g key={label} className="rg">
            <ellipse {...ellipse} fill={`rgba(8,21,38,${i * 0.07})`} />
            <ellipse {...ellipse} className="ring" />
            <rect x={tx - 4} y={ty - 9} width={label.length * 7 + 16} height="18" rx="9" fill="#050B14" stroke="rgba(244,248,252,.14)" />
            <text x={tx + 4} y={ty + 3.6} fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#9AA8B7" letterSpacing="1">
              {label}
            </text>
          </g>
        )
      })}
      <ellipse cx="336" cy="288" rx="30" ry="28" fill="url(#tc)" />
      <path
        id="tpath"
        d="M 30 300 C 90 90, 250 70, 336 288"
        fill="none"
        stroke="rgba(244,248,252,.28)"
        strokeWidth=".8"
        strokeDasharray="3 6"
        opacity=".5"
      />
      {prefersReducedMotion ? (
        <circle r="5" fill="#00D9FF" cx="336" cy="288" />
      ) : (
        <circle r="5" fill="#00D9FF">
          <animateMotion dur="7s" repeatCount="indefinite">
            <mpath href="#tpath" />
          </animateMotion>
        </circle>
      )}
    </svg>
  )
}

export default function Augent() {
  return (
    <section className="sec" id="augent" aria-labelledby="h-a">
      <div className="aug-art" aria-hidden="true">
        <Tunnel />
      </div>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="aug-t">
          <ParticleText as="p" className="eyebrow" reveal text="AuGENT · Enterprise GenAI" />
          <Reveal as="h2" id="h-a">
            Enterprise <em>intelligence</em> that can act.
          </Reveal>
          <Reveal as="p" className="lead">
            AuGENT is the intelligence engine inside the system: it draws on enterprise knowledge, retrieves, reasons,
            validates, and then acts within the controls your business already trusts.
          </Reveal>
          <Reveal className="btns">
            <a className="btn p" href="#cta">
              Explore AuGENT <i>→</i>
            </a>
          </Reveal>
        </div>
        <div className="acs">
          {FEATURES.map((f) => (
            <div key={f.key} className={`card ac ${f.key} hv`}>
              <span className="mono">{f.label}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
