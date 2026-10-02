import Footer from './components/Footer.jsx'
import IntelligenceField from './components/IntelligenceField.jsx'
import Nav from './components/Nav.jsx'
import SpectralRibbon from './components/SpectralRibbon.jsx'
import Augent from './sections/Augent.jsx'
import Cta from './sections/Cta.jsx'
import Docs from './sections/Docs.jsx'
import Hero from './sections/Hero.jsx'
import Impact from './sections/Impact.jsx'
import Industries from './sections/Industries.jsx'
import Insights from './sections/Insights.jsx'
import Proof from './sections/Proof.jsx'
import Question from './sections/Question.jsx'
import Responsible from './sections/Responsible.jsx'
import Strategy from './sections/Strategy.jsx'
import Topo from './sections/Topo.jsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <IntelligenceField />
      <main id="main">
        <Hero />
        <Question />
        <SpectralRibbon />
        <Topo />
        <Impact />
        <SpectralRibbon />
        <Industries />
        <Augent />
        <Docs />
        <Strategy />
        <Responsible />
        <Proof />
        <Insights />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
