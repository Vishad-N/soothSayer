import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView.js'
import { cx, prefersReducedMotion } from '../lib/utils.js'

const SETTLE_OPTIONS = { threshold: 0.4 }

// Letters start scattered and drift into place when the text enters view.
// `scatterOnCardHover` re-scatters briefly whenever the enclosing .card is hovered.
export default function ParticleText({
  as: Tag = 'span',
  text,
  className,
  reveal = false,
  delay,
  scatterOnCardHover = false,
  style,
}) {
  const ref = useRef(null)
  const settled = useInView(ref, SETTLE_OPTIONS)
  const revealed = useInView(ref)
  const [hoverScatter, setHoverScatter] = useState(false)

  const offsets = useMemo(
    () => [...text].map(() => ({ dx: Math.random() * 40 - 20, dy: Math.random() * 36 - 18 })),
    [text],
  )

  useEffect(() => {
    if (!scatterOnCardHover || prefersReducedMotion) return
    const host = ref.current?.closest('.card')
    if (!host) return
    let timer
    const onEnter = () => {
      setHoverScatter(true)
      clearTimeout(timer)
      timer = setTimeout(() => setHoverScatter(false), 420)
    }
    host.addEventListener('mouseenter', onEnter)
    return () => {
      host.removeEventListener('mouseenter', onEnter)
      clearTimeout(timer)
    }
  }, [scatterOnCardHover])

  const scattered = !prefersReducedMotion && (!settled || hoverScatter)

  return (
    <Tag
      ref={ref}
      className={cx(className, 'pt', scattered && 'sc', reveal && 'rv', reveal && revealed && 'in')}
      style={delay ? { ...style, '--d': delay } : style}
      aria-label={text}
    >
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ '--i': i, '--dx': `${offsets[i].dx}px`, '--dy': `${offsets[i].dy}px` }}
        >
          {ch}
        </span>
      ))}
    </Tag>
  )
}
