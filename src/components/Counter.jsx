import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView.js'
import { clamp, prefersReducedMotion } from '../lib/utils.js'

const COUNT_OPTIONS = { threshold: 0.5 }
const DURATION_MS = 1800

// Shows the final value until in view, then counts up from zero with an ease-out.
export default function Counter({ to, prefix = '', suffix = '', grouped = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, COUNT_OPTIONS)
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (!inView || prefersReducedMotion) return
    let raf
    const start = performance.now()
    const step = (now) => {
      const k = clamp((now - start) / DURATION_MS)
      setValue(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    step(start)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])

  return (
    <span ref={ref} className="count">
      {prefix}
      {grouped ? value.toLocaleString('en-US') : value}
      {suffix}
    </span>
  )
}
