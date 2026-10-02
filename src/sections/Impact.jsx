import Counter from '../components/Counter.jsx'
import Meter from '../components/Meter.jsx'
import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'

function Stat({ className, size, percent, children }) {
  return (
    <Reveal className={className}>
      <div className={`n ${size}`}>{children}</div>
      <Meter percent={percent} />
    </Reveal>
  )
}

function StatCard({ className, label, title, body }) {
  return (
    <Reveal className={`card mc hv ${className}`}>
      <span className="mono">{label}</span>
      <b>{title}</b>
      <p>{body}</p>
    </Reveal>
  )
}

// The grid interleaves big numbers and cards; order matters for the 12-column layout.
export default function Impact() {
  return (
    <section className="sec" id="impact" aria-labelledby="h-i">
      <svg className="dec arcs" viewBox="0 0 1600 1400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#23405F" strokeWidth="1">
          <circle cx="800" cy="700" r="560" />
          <circle cx="800" cy="700" r="700" strokeDasharray="2 10" />
          <circle cx="800" cy="700" r="860" opacity=".6" />
          <circle cx="800" cy="700" r="1020" opacity=".4" />
        </g>
      </svg>
      <div className="wrap">
        <div className="imp-h">
          <ParticleText as="p" className="eyebrow" reveal text="Real business impact" />
          <Reveal as="h2" id="h-i">
            Measured in <em>outcomes,</em> not output.
          </Reveal>
        </div>
        <div className="ig">
          <Stat className="i1" size="nb" percent="100%">
            <Counter to={150} prefix="$" suffix="M+" />
          </Stat>
          <StatCard className="c1" label="Procurement impact" title="$150M+" body="Impact delivered in procurement." />
          <StatCard
            className="c2"
            label="Manual processes"
            title="70% reduction"
            body="Less manual effort across intelligent workflows."
          />
          <Stat className="i2" size="nm" percent="70%">
            <Counter to={70} suffix="%" />
          </Stat>
          <Stat className="i3" size="nm" percent="100%">
            <Counter to={10} suffix="×" />
            <span
              className="mono"
              style={{ fontSize: '.14em', letterSpacing: '.2em', marginLeft: 14, color: 'var(--ice)' }}
            >
              ROI
            </span>
          </Stat>
          <StatCard
            className="c3"
            label="Forecasting to fulfillment"
            title="10× ROI"
            body="Return from connecting prediction to execution."
          />
          <StatCard
            className="c4"
            label="Capability building"
            title="25,000+ trained"
            body="Leaders and professionals trained."
          />
          <Stat className="i4" size="ns" percent="100%">
            <Counter to={25000} suffix="+" grouped />
          </Stat>
        </div>
      </div>
    </section>
  )
}
