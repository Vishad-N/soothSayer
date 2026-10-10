import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clamp } from '../../lib/utils.js'
import { createNetwork, STAGES } from './network.js'

gsap.registerPlugin(ScrollTrigger)

// Scroll distance of the pin, in viewport heights. IntelligenceField's #topo stops are
// fractions of this distance (see FIELD_STOPS), so they survive a change here.
const PIN_VH = 4
// Extra scroll after the last stage so the finished state holds before unpinning.
const HOLD = 0.4

// Pinned scroll drives one number, v in 0..1. The network is a pure function of v, so
// scrubbing back and forth is exact; v is eased toward the scroll position each frame.
export function useTransformationScroll({ sectionRef, pinRef, canvasRef, stepsRef, railRef, barRef, liveRef, count }) {
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const steps = [...stepsRef.current.children]
    const pills = [...railRef.current.children]
    const last = steps.length - 1
    const mm = gsap.matchMedia(sectionRef.current)

    mm.add(
      { full: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const reduced = ctx.conditions.reduced
        const net = createNetwork(canvas, { count, reduced })
        const stacked = window.matchMedia('(max-width: 899px)')

        let target = 0
        let current = 0
        let active = -1
        let raf = 0
        let prevTime = 0
        let slow = 0

        // reduced motion: no easing, and each stage is shown fully resolved
        const shown = () => (reduced ? Math.min(last, Math.floor(target * STAGES)) / STAGES + 0.9 / STAGES : current)

        const setActive = (v) => {
          const idx = Math.min(last, Math.floor(clamp(v) * STAGES))
          if (idx !== active) {
            active = idx
            steps.forEach((el, i) => {
              el.classList.toggle('on', i === idx)
              el.setAttribute('aria-hidden', i !== idx)
            })
            pills.forEach((p, i) => p.classList.toggle('on', i === idx))
            liveRef.current.textContent = steps[idx].dataset.label
          }
          barRef.current.style.transform = `scaleX(${clamp(v).toFixed(4)})`
        }

        const layout = () => net.resize({ panelH: stepsRef.current.offsetHeight, stacked: stacked.matches })

        const paint = (time) => {
          const v = shown()
          net.draw(v, time)
          setActive(v)
        }

        const tick = (now) => {
          raf = requestAnimationFrame(tick)
          const dt = Math.min(0.05, (now - prevTime) / 1000 || 0.016)
          prevTime = now
          current += (target - current) * (1 - Math.exp(-dt * 8))
          if (Math.abs(target - current) < 1e-4) current = target
          paint(now / 1000)
          // sustained slow frames: drop to 1x pixel density once, then leave it alone
          slow = dt > 0.03 ? slow + 1 : Math.max(0, slow - 1)
          if (slow > 45 && net.degrade()) {
            slow = 0
            layout()
          }
        }
        const run = () => {
          if (reduced || raf) return
          prevTime = performance.now()
          raf = requestAnimationFrame(tick)
        }
        const halt = () => {
          cancelAnimationFrame(raf)
          raf = 0
        }

        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * PIN_VH}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            target = clamp((self.progress * (STAGES + HOLD)) / STAGES)
            if (reduced) paint(0)
          },
        })

        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? run() : halt()))
        io.observe(sectionRef.current)

        const ro = new ResizeObserver(() => {
          layout()
          paint(performance.now() / 1000)
        })
        ro.observe(canvas.parentElement)

        // start from wherever the page already is (reload mid-section, anchor jump)
        target = clamp((st.progress * (STAGES + HOLD)) / STAGES)
        current = target
        layout()
        paint(0)

        return () => {
          halt()
          io.disconnect()
          ro.disconnect()
          st.kill()
        }
      },
    )

    return () => mm.revert()
  }, [sectionRef, pinRef, canvasRef, stepsRef, railRef, barRef, liveRef, count])
}
