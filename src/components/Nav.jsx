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
        <a href="#cta" className="btn p">
          Talk to an AI strategist <i>→</i>
        </a>
      </header>
    </>
  )
}
