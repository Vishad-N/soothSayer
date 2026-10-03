import TextHoverEffect from './TextHoverEffect.jsx'

const FOOTER_LINKS = [
  ['#augent', 'Solutions'],
  ['#ind', 'Industries'],
  ['#hero', 'Company'],
  ['#knowledge', 'Insights'],
  ['#cta', 'Contact'],
]

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <nav className="fnav" aria-label="Footer">
          {FOOTER_LINKS.map(([href, label]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="fline" aria-hidden="true" />
      <div className="wrap">
        <div className="flegal">
          <span>© 2026 Soothsayer Analytics</span>
          <span>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">LinkedIn</a>
          </span>
        </div>
        <div className="wm">
          <TextHoverEffect text="Soothsayer" subText="Analytics" />
        </div>
      </div>
    </footer>
  )
}
