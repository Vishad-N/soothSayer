import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/utils.js'

const LINKS = [
  ['#augent', 'Solutions'],
  ['#ind', 'Industries'],
  ['#impact', 'Impact'],
  ['#augent', 'Intelligence'],
  ['#knowledge', 'Insights'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
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

  // Escape closes the phone menu so keyboard users are never trapped behind it.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div id="prog" ref={progressRef} aria-hidden="true" />
      <header className={cx('nav', (scrolled || open) && 'sc', open && 'open')} id="nav">
        <a href="#hero" className="logo" aria-label="Soothsayer Analytics home">
          <img src="/logo.svg" alt="Soothsayer Analytics" width="116" height="34" />
        </a>
        <nav aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="nav-tg"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
        <a href="#cta" className="gs-btn">
          Get Started
          <span className="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
        <nav id="nav-menu" className="nav-menu" aria-label="Menu" hidden={!open}>
          {LINKS.map(([href, label]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </header>
    </>
  )
}
