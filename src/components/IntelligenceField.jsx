import { useEffect, useRef } from 'react'
import { createRng, lerp, prefersReducedMotion, smoothstep } from '../lib/utils.js'

// Keyframes for the global background field, interpolated by scroll position.
// [selector, fraction-through-section, chaos, order, route, alpha, xCentre, xWidth, yCentre, spread]
const FIELD_STOPS = [
  ['#hero', 0.3, 0.85, 0.15, 0.3, 0.95, 0.75, 0.5, 0.52, 0.9],
  ['#question', 0.5, 0.6, 0.3, 0.1, 0.5, 0.5, 0.9, 0.5, 0.85],
  // #topo is pinned for 4.5 viewport heights (+ a hold); fractions mark the six card stages
  ['#topo', 0.09, 0.95, 0.05, 0, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.142, 0.95, 0.05, 0, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.27, 0.7, 0.3, 0.12, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.398, 0.5, 0.55, 0.45, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.525, 0.3, 0.72, 0.62, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.653, 0.15, 0.85, 0.85, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.781, 0.04, 0.94, 1, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#topo', 0.91, 0.03, 0.95, 1, 0.95, 0.5, 1.4, 0.68, 0.52],
  ['#impact', 0.5, 0.15, 0.85, 0.6, 0.28, 0.5, 1.3, 0.62, 0.8],
  ['#ind', 0.5, 0.2, 0.7, 0.5, 0.24, 0.5, 1.2, 0.5, 0.9],
  ['#augent', 0.5, 0.1, 0.8, 0.5, 0.07, 0.5, 1, 0.5, 0.8],
  ['#docs', 0.5, 0.1, 0.8, 0.5, 0.08, 0.5, 1, 0.5, 0.8],
  ['#strategy', 0.5, 0.1, 0.8, 0.5, 0.07, 0.5, 1, 0.5, 0.8],
  ['#resp', 0.5, 0.1, 0.8, 0.5, 0.09, 0.5, 1, 0.5, 0.8],
  ['#proof', 0.5, 0.3, 0.6, 0.4, 0.22, 0.5, 1.2, 0.55, 0.7],
  ['#ins', 0.5, 0.2, 0.7, 0.4, 0.2, 0.5, 1.2, 0.55, 0.8],
  ['#cta', 0.35, 0.03, 1, 1, 0.7, 0.5, 1.4, 0.74, 0.7],
]

export default function IntelligenceField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const stops = FIELD_STOPS.map(([selector, f, ...v]) => ({ el: document.querySelector(selector), f, v })).filter(
      (s) => s.el,
    )
    if (!stops.length) return

    let W, H, mobile, N
    let fibres = []
    let particles = []
    let mx = -999
    let my = -999
    let visible = true
    let raf = 0

    function setup() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      W = window.innerWidth
      H = window.innerHeight
      mobile = W < 760
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const rnd = createRng(3)
      N = mobile ? 30 : 58
      fibres = []
      for (let i = 0; i < N; i++) fibres.push({ k1: rnd(), k2: rnd(), k3: rnd(), p: rnd() * 6.28, al: 0.3 + rnd() * 0.7 })
      particles = []
      for (let i = 0; i < (mobile ? 60 : 140); i++)
        particles.push({ i: Math.floor(rnd() * N), u: rnd(), s: 0.01 + rnd() * 0.03, r: 0.5 + rnd() * 1.3, hot: rnd() < 0.12 })
    }

    function params() {
      const yc = window.scrollY + window.innerHeight * 0.5
      const st = stops
        .map((k) => {
          const r = k.el.getBoundingClientRect()
          return { y: r.top + window.scrollY + k.f * r.height, v: k.v }
        })
        .sort((a, b) => a.y - b.y)
      if (yc <= st[0].y) return st[0].v.slice()
      if (yc >= st[st.length - 1].y) return st[st.length - 1].v.slice()
      for (let i = 0; i < st.length - 1; i++) {
        if (yc <= st[i + 1].y) {
          const t = smoothstep((yc - st[i].y) / (st[i + 1].y - st[i].y || 1))
          return st[i].v.map((v, j) => lerp(v, st[i + 1].v[j], t))
        }
      }
    }

    function frame(t) {
      const [c, o, r, a, xc, xw, yc, S] = params()
      ctx.clearRect(0, 0, W, H)
      if (a < 0.02) return
      const g = ctx.createLinearGradient(0, 0, W, 0)
      const gc = ctx.createLinearGradient(0, 0, W, 0)
      for (let s = 0; s <= 10; s++) {
        const u = s / 10
        const e = Math.exp(-Math.pow(u - xc, 2) / (2 * Math.pow(xw / 2.4, 2)))
        g.addColorStop(u, `rgba(22,119,255,${e * a})`)
        gc.addColorStop(u, `rgba(0,217,255,${Math.min(1, e * 1.3) * (0.35 + 0.65 * r)})`)
      }
      const route = (u) => yc * H + Math.sin(u * 2.6 + 0.8 + t * 0.1) * H * 0.09 + (u - 0.5) * H * 0.1
      const yAt = (i, tt, u, px) => {
        const f = fibres[i]
        let y = yc * H + (tt - 0.5) * S * H * (0.55 + 0.9 * tt)
        const chaos =
          (Math.sin(u * (5 + f.k1 * 10) + f.p + t * (0.15 + f.k2 * 0.2)) * 0.5 +
            Math.sin(u * (11 + f.k3 * 20) + f.p * 2 - t * 0.2) * 0.3) *
          H * 0.13 * c
        const order =
          (Math.sin(u * 3.2 + tt * 1.2 + t * 0.25) * 0.6 + Math.sin(u * 6.4 - tt * 2 + t * 0.18) * 0.25) *
          H * 0.09 * (1 + tt * 0.6) * (0.25 + o * 0.75)
        y += chaos + order
        const Ru = route(u)
        y += (Ru - yc * H) * r * 0.85
        const d = y - Ru
        y += -d * Math.exp(-(d * d) / (2 * Math.pow(H * 0.07, 2))) * r * 0.5
        const dx = px - mx
        const dy = y - my
        y += (dy >= 0 ? 1 : -1) * Math.exp(-(dx * dx + dy * dy) / (2 * 130 * 130)) * 26
        return y
      }

      ctx.lineWidth = 0.9
      ctx.strokeStyle = g
      for (let i = 0; i < N; i++) {
        const tt = i / (N - 1)
        ctx.globalAlpha = fibres[i].al
        ctx.beginPath()
        for (let px = -20; px <= W + 20; px += mobile ? 22 : 14) {
          const y = yAt(i, tt, px / W, px)
          px === -20 ? ctx.moveTo(px, y) : ctx.lineTo(px, y)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      for (const p of particles) {
        const u = (p.u + t * p.s) % 1
        const px = u * W
        const y = yAt(p.i, p.i / (N - 1), u, px)
        const e = Math.exp(-Math.pow(u - xc, 2) / (2 * Math.pow(xw / 2.4, 2)))
        ctx.fillStyle = p.hot ? `rgba(0,217,255,${0.8 * e * a})` : `rgba(155,243,255,${0.5 * e * a})`
        ctx.beginPath()
        ctx.arc(px, y, p.r, 0, 6.283)
        ctx.fill()
      }

      // cyan route
      ctx.beginPath()
      for (let px = -20; px <= W + 20; px += 8) {
        const u = px / W
        const y = route(u) + Math.sin(u * 14 + t * 0.5) * 8 * c
        px === -20 ? ctx.moveTo(px, y) : ctx.lineTo(px, y)
      }
      ctx.strokeStyle = gc
      ctx.lineWidth = 1 + 1.8 * r
      ctx.shadowColor = 'rgba(0,217,255,.7)'
      ctx.shadowBlur = 14 * r + 4
      ctx.globalAlpha = Math.min(1, a + 0.1)
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    const drawStatic = () => frame(0)
    const onResize = () => {
      setup()
      if (prefersReducedMotion) frame(0)
    }
    const onPointerMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }
    const onPointerLeave = () => {
      mx = my = -999
    }
    const onVisibility = () => {
      visible = !document.hidden
    }

    setup()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)

    if (prefersReducedMotion) {
      frame(0)
      window.addEventListener('scroll', drawStatic, { passive: true })
    } else {
      const loop = (now) => {
        if (visible) frame(now / 1000)
        raf = requestAnimationFrame(loop)
      }
      loop(performance.now())
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', drawStatic)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas id="field" ref={canvasRef} aria-hidden="true" />
}
