export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const smoothstep = (t) => t * t * (3 - 2 * t)

// Park–Miller LCG. Seeded so the generated artwork is identical on every load.
export function createRng(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// 0 → 1 progress of a tall (sticky) section as it scrolls past the viewport.
export function sectionProgress(el) {
  const r = el.getBoundingClientRect()
  return clamp(-r.top / (r.height - window.innerHeight))
}

export const cx = (...classes) => classes.filter(Boolean).join(' ')
