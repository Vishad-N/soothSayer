import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'

const QUESTIONS = [
  { title: 'Predict', body: 'What will happen next?' },
  { title: 'Optimize', body: 'What is the best decision under real constraints?' },
  { title: 'Understand', body: 'What is hidden in text, images and sensors?' },
  { title: 'Automate', body: 'Which work can intelligent systems carry?' },
]

const WAVES = Array.from({ length: 9 }, (_, i) => {
  const y = 250 + i * 26
  const a = 60 + i * 14
  return {
    d: `M-50 ${y} C 250 ${y - a}, 500 ${y + a}, 800 ${y} S 1350 ${y - a * 1.2}, 1650 ${y + 10} L1650 800 L-50 800 Z`,
    strokeOpacity: 0.25 + i * 0.05,
    opacity: 0.7 - i * 0.05,
  }
})

export default function Question() {
  return (
    <section className="sec q-wrap" id="question" aria-labelledby="h-q">
      <svg className="dec q-art" viewBox="0 0 1600 700" aria-hidden="true">
        <defs>
          <linearGradient id="qg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#9AA8B7" stopOpacity=".07" />
            <stop offset=".55" stopColor="#9AA8B7" stopOpacity=".02" />
            <stop offset="1" stopColor="#9AA8B7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="qline" x1="0" x2="1">
            <stop offset="0" stopColor="#F4F8FC" stopOpacity=".05" />
            <stop offset=".5" stopColor="#F4F8FC" stopOpacity=".34" />
            <stop offset="1" stopColor="#00D9FF" stopOpacity=".5" />
          </linearGradient>
        </defs>
        {WAVES.map((w, i) => (
          <path
            key={i}
            d={w.d}
            fill="url(#qg)"
            stroke="url(#qline)"
            strokeWidth="1"
            strokeOpacity={w.strokeOpacity}
            opacity={1 - i * 0.06}
          />
        ))}
      </svg>
      <div className="wrap" style={{ position: 'static', maxWidth: 'none', width: '100%', padding: 0 }}>
        <Reveal className="q-c">
          <span className="scrim" aria-hidden="true" />
          <ParticleText as="p" className="eyebrow" text="The business question" />
          <h2 id="h-q">
            What are you trying to <em>improve?</em>
          </h2>
          <p className="lead">Enterprise AI begins with a business problem worth solving.</p>
        </Reveal>
        <div className="qs">
          {QUESTIONS.map((q, i) => (
            <Reveal
              key={q.title}
              as="a"
              href="#augent"
              className={`card qc q${i + 1}`}
              delay={i ? `.${i}s` : undefined}
            >
              <span className="mono">0{i + 1}</span>
              <h3>{q.title}</h3>
              <p>{q.body}</p>
              <span className="go">
                Explore <i className="arr">→</i>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
