import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Scroll distance of the pin, in viewport heights. IntelligenceField's #topo stops are
// tuned to this value (see FIELD_STOPS), so change both together.
const PIN_VH = 4.5
// Extra timeline time after the last card so the finished state holds before unpinning.
const HOLD = 0.4

// Card pressure states: rest → inflate → tension. The shard layer is frozen at TENSION.
const REST = { scaleX: 1, scaleY: 1, y: 0, borderRadius: 26, borderColor: '#23405f', boxShadow: '0 24px 60px rgba(0,0,0,.35), 0 0 0 rgba(0,217,255,0)' }
const INFLATED = { scaleX: 1.06, scaleY: 1.12, y: -6, borderRadius: 34, borderColor: '#2f6bc4', boxShadow: '0 34px 84px rgba(0,0,0,.5), 0 0 40px rgba(0,217,255,.18)' }
const TENSION = { scaleX: 1.07, scaleY: 1.14, y: -7, borderRadius: 34, borderColor: '#00d9ff', boxShadow: '0 38px 96px rgba(0,0,0,.55), 0 0 56px rgba(0,217,255,.4)' }
const FINAL = { scaleX: 1.04, scaleY: 1.07, y: -4, borderRadius: 32, borderColor: '#00d9ff', boxShadow: '0 34px 90px rgba(0,0,0,.5), 0 0 64px rgba(0,217,255,.35)' }

// Scroll-scrubbed vibration: a fixed zig-zag whose amplitude grows with the pressure.
const shake = (peakX, peakRot, steps = 24) => ({
  x: Array.from({ length: steps }, (_, k) => (k === steps - 1 ? 0 : (k % 2 ? 1 : -1) * (k / steps) * peakX * (0.65 + 0.35 * Math.sin(k * 2.3)))),
  rotation: Array.from({ length: steps }, (_, k) => (k === steps - 1 ? 0 : (k % 3 ? -1 : 1) * (k / steps) * peakRot * (0.65 + 0.35 * Math.cos(k * 1.7)))),
  easeEach: 'none',
})

// text sits in .cbody, which is scaled by the inverse of its card so letters never stretch
const inverse = (s) => ({ scaleX: 1 / s.scaleX, scaleY: 1 / s.scaleY })

// Section-local timeline: segment i spans [i, i+1] and each card runs
// rebuild (0–.18) → rest → inflate (.28–.72) → tension (.72–.80) → burst (.80–.96).
export function useTransformationScroll({ sectionRef, pinRef, stageRef, railRef, liveRef, fragments }) {
  useLayoutEffect(() => {
    const stage = stageRef.current
    const slots = gsap.utils.toArray('.cslot', stage)
    const flash = stage.querySelector('.cflash')
    const pills = [...railRef.current.children]
    const last = slots.length - 1

    const cards = slots.map((slot) => ({
      slot,
      face: slot.querySelector(':scope > .cface'),
      body: slot.querySelector(':scope > .cface > .cbody'),
      parts: gsap.utils.toArray(':scope > .cface > .cbody > [data-c]', slot),
      shell: slot.querySelector(':scope > .cfrags'),
      pieces: gsap.utils.toArray('.cfrag', slot),
      pieceBodies: gsap.utils.toArray('.cfrag .cbody', slot),
    }))

    let activeIndex = -1
    const setActive = (time) => {
      const idx = gsap.utils.clamp(0, last, Math.floor(time - 0.1))
      if (idx === activeIndex) return
      activeIndex = idx
      pills.forEach((p, i) => p.classList.toggle('on', i === idx))
      cards.forEach((c, i) => c.slot.setAttribute('aria-hidden', i !== idx))
      liveRef.current.textContent = `${slots[idx].dataset.label}`
    }

    const mm = gsap.matchMedia(sectionRef.current)

    const build = (reduced) => {
      activeIndex = -1
      // initial state = the `from` state of each element's first tween
      cards.forEach((c, i) => {
        if (i > 0) gsap.set(c.face, { autoAlpha: 0 })
        if (i > 0) gsap.set(c.parts, { autoAlpha: 0, y: 10 })
        if (c.shell) {
          gsap.set(c.shell, { autoAlpha: 0, scaleX: TENSION.scaleX, scaleY: TENSION.scaleY, y: TENSION.y })
          gsap.set(c.pieceBodies, inverse(TENSION))
        }
      })
      gsap.set(flash, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * PIN_VH}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(self.progress * tl.duration()),
        },
      })

      cards.forEach((c, i) => {
        const t0 = i
        const isLast = i === last

        // rebuild: the new card surface, then its text, one line after another
        if (i > 0) {
          tl.fromTo(c.face, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: 'none' }, t0 + 0.05)
          tl.fromTo(c.parts, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power1.out', stagger: 0.03 }, t0 + 0.1)
        }

        if (reduced) {
          // inflate gently, then dissolve; no moving fragments
          tl.fromTo(c.face, { scaleX: 1, scaleY: 1 }, { scaleX: 1.03, scaleY: 1.05, duration: 0.44, ease: 'sine.inOut' }, t0 + 0.28)
          if (!isLast) tl.fromTo(c.face, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15, ease: 'none' }, t0 + 0.82)
          return
        }

        const target = isLast ? FINAL : INFLATED
        const inflateDur = isLast ? 0.52 : 0.44
        tl.fromTo(c.face, REST, { ...target, duration: inflateDur, ease: 'sine.inOut' }, t0 + 0.28)
        tl.fromTo(c.body, { scaleX: 1, scaleY: 1 }, { ...inverse(target), duration: inflateDur, ease: 'sine.inOut' }, t0 + 0.28)
        // vibration builds while the card inflates (only x/rotation, so it never fights the scale/y tween)
        tl.to(c.face, { keyframes: shake(isLast ? 0.9 : 1.8, isLast ? 0.08 : 0.2), duration: inflateDur }, t0 + 0.28)
        if (isLast) return

        // pressure peaks: a short, tight build with a barely-there tremor
        tl.fromTo(c.face, INFLATED, { ...TENSION, duration: 0.08, ease: 'power2.in' }, t0 + 0.72)
        tl.fromTo(c.body, inverse(INFLATED), { ...inverse(TENSION), duration: 0.08, ease: 'power2.in' }, t0 + 0.72)
        tl.to(c.face, { keyframes: { x: [0, 1.5, -1.5, 1, -1, 0], easeEach: 'none' }, duration: 0.08 }, t0 + 0.72)

        // burst: the whole card swaps for its shards at peak tension, then they release
        const b = t0 + 0.8
        const T = fragments
        const at = (key, k) => T[k][key]
        tl.fromTo(c.face, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.001, ease: 'none' }, b)
        tl.fromTo(c.shell, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001, ease: 'none' }, b)
        tl.fromTo(flash, { opacity: 0 }, { opacity: 0.85, duration: 0.03, ease: 'power2.out' }, b)
        tl.fromTo(flash, { opacity: 0.85 }, { opacity: 0, duration: 0.1, ease: 'power2.in' }, b + 0.03)

        const apart = (k) => ({ x: at('x', k) * 0.12, y: at('y', k) * 0.12, rotation: at('rotation', k) * 0.2 })
        tl.fromTo(c.pieces, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }, { x: (k) => apart(k).x, y: (k) => apart(k).y, rotation: (k) => apart(k).rotation, duration: 0.03, ease: 'power1.in' }, b)
        tl.fromTo(
          c.pieces,
          { x: (k) => apart(k).x, y: (k) => apart(k).y, rotation: (k) => apart(k).rotation, scale: 1, opacity: 1 },
          { x: (k) => at('x', k), y: (k) => at('y', k), rotation: (k) => at('rotation', k), scale: (k) => at('scale', k), opacity: 0.3, duration: 0.1, ease: 'power3.out', stagger: 0.002 },
          b + 0.03,
        )
        tl.fromTo(c.pieceBodies, { opacity: 1 }, { opacity: 0, duration: 0.05, ease: 'power1.in' }, b + 0.02)

        // reconstruction, one segment later: shards fall back into the card shape
        const r = t0 + 1
        tl.fromTo(
          c.pieces,
          { x: (k) => at('x', k), y: (k) => at('y', k), rotation: (k) => at('rotation', k), scale: (k) => at('scale', k) },
          { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.14, ease: 'power2.inOut', stagger: 0.002 },
          r,
        )
        tl.fromTo(c.pieces, { opacity: 0.3 }, { opacity: 0.85, duration: 0.08, ease: 'none' }, r)
        tl.fromTo(c.pieces, { opacity: 0.85 }, { opacity: 0, duration: 0.07, ease: 'none' }, r + 0.1)
        tl.fromTo(c.shell, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.001, ease: 'none' }, r + 0.18)
      })

      tl.to({}, { duration: HOLD }, slots.length)
      setActive(0)
    }

    mm.add(
      { full: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        build(ctx.conditions.reduced)
      },
    )

    return () => mm.revert()
  }, [sectionRef, pinRef, stageRef, railRef, liveRef, fragments])
}
