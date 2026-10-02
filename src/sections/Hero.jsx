import ParticleText from '../components/ParticleText.jsx'
import Reveal from '../components/Reveal.jsx'

const SIGNAL_CARDS = [
  { variant: 'a', label: 'Pattern detected', title: 'Predictive signal', chip: 'High relevance' },
  { variant: 'b', label: 'Optimization', title: '12 variables', chip: '1 recommended path' },
  { variant: 'c', label: 'Signal', title: 'Demand volatility', chip: 'Detected' },
]

export default function Hero() {
  return (
    <section className="sec hero" id="hero" aria-labelledby="h-hero">
      <div className="wrap">
        <div className="hero-t">
          <ParticleText as="p" className="eyebrow" reveal text="Enterprise AI • Data Science • Intelligence" />
          <Reveal as="h1" id="h-hero" delay=".1s">
            Find the <em>signal</em> inside your most expensive decisions.
          </Reveal>
          <Reveal as="p" className="lead" delay=".2s">
            Soothsayer turns complex enterprise data into predictive intelligence, intelligent workflows and decisions
            teams can act on.
          </Reveal>
          <Reveal className="btns" delay=".3s">
            <a className="btn p" href="#cta">
              Talk to an AI strategist <i>→</i>
            </a>
            <a className="btn s" href="#impact">
              Explore real outcomes <i>→</i>
            </a>
          </Reveal>
        </div>
        <div className="hcs" aria-hidden="true">
          {SIGNAL_CARDS.map((card) => (
            <div key={card.variant} className={`card hc ${card.variant}`}>
              <ParticleText className="mono" text={card.label} scatterOnCardHover />
              <div className="row">
                <b>{card.title}</b>
              </div>
              <div className="row">
                <span className="chip">{card.chip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="cue" aria-hidden="true" />
    </section>
  )
}
