import Reveal from '../components/Reveal.jsx'

const SIGNAL_PATH = 'M-30 650 C 300 670, 420 830, 720 830 S 1180 780, 1300 540 S 1420 320, 1480 300'

export default function Cta() {
  return (
    <section className="sec" id="cta" aria-labelledby="h-cta">
      <svg className="dec sig" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="sg1" x1="0" x2="1">
            <stop offset="0" stopColor="#1677FF" stopOpacity=".1" />
            <stop offset=".4" stopColor="#00D9FF" />
            <stop offset="1" stopColor="#00D9FF" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="#23405F" vectorEffect="non-scaling-stroke">
          <ellipse cx="720" cy="1200" rx="1100" ry="720" vectorEffect="non-scaling-stroke" opacity=".6" />
          <ellipse cx="720" cy="1300" rx="1400" ry="800" vectorEffect="non-scaling-stroke" opacity=".35" />
        </g>
        <path
          d={SIGNAL_PATH}
          fill="none"
          stroke="url(#sg1)"
          strokeWidth="2.4"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        <path
          className="sigrun"
          d={SIGNAL_PATH}
          fill="none"
          stroke="#F4F8FC"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="cta-c">
          <span className="scrim" />
          <Reveal as="h2" id="h-cta">
            There&apos;s more value hiding in your <em>data.</em>
          </Reveal>
          <Reveal as="p" className="sup">
            LET&apos;S FIND IT.
          </Reveal>
          <Reveal className="btns">
            <a className="btn p" href="mailto:hello@soothsayer-analytics.com">
              Talk to an AI strategist <i>→</i>
            </a>
            <a className="btn s" href="#augent">
              Explore our capabilities <i>→</i>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
