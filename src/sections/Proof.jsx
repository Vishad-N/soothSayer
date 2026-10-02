import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'

const WAVES = Array.from({ length: 14 }, (_, i) => {
  const y = 300 + i * 34
  return {
    d: `M-50 ${y} C 300 ${y - 160}, 700 ${y + 180}, 1000 ${y - 20} S 1500 ${y - 120}, 1650 ${y + 20}`,
    opacity: 0.1 + i * 0.025,
  }
})

const visuallyHidden = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }

export default function Proof() {
  return (
    <section className="sec" id="proof" aria-labelledby="h-p">
      <svg className="dec proof-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="pg" x1="0" x2="1">
            <stop offset="0" stopColor="#0C2140" />
            <stop offset="1" stopColor="#081526" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#pg)" />
        {WAVES.map((w, i) => (
          <path key={i} d={w.d} fill="none" stroke="#1677FF" strokeWidth="1" opacity={w.opacity} />
        ))}
        {[380, 560, 760].map((r, i) => (
          <circle key={r} cx="1280" cy="200" r={r} fill="none" stroke="#23405F" opacity={0.5 - i * 0.12} />
        ))}
      </svg>
      <div className="wrap" style={{ width: '100%' }}>
        <h2 id="h-p" style={visuallyHidden}>
          Client proof
        </h2>
        <Reveal className="card pcard">
          <ParticleText as="p" className="eyebrow" style={{ margin: 0 }} text="Client proof" />
          <blockquote>
            [Insert approved client testimonial here: one or two sentences on the outcome Soothsayer delivered.]
          </blockquote>
          <div className="pmeta">
            <span className="chip">Company</span>
            <span className="chip">Role</span>
            <span className="chip">Industry</span>
          </div>
          <p className="ph">PLACEHOLDER · replace with a verified, approved quote</p>
        </Reveal>
      </div>
    </section>
  )
}
