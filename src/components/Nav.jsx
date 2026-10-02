import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/utils.js'

const LINKS = [
  ['#augent', 'Solutions'],
  ['#ind', 'Industries'],
  ['#impact', 'Impact'],
  ['#augent', 'Intelligence'],
  ['#ins', 'Insights'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 40)
      // Written directly to avoid re-rendering on every scroll tick.
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div id="prog" ref={progressRef} aria-hidden="true" />
      <header className={cx('nav', scrolled && 'sc')} id="nav">
        <a href="#hero" className="logo" aria-label="Soothsayer Analytics home">
          <b />
          SOOTHSAYER
        </a>
        <nav aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#cta" className="gs-btn">
          Get Started
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </header>
    </>
  )
}
