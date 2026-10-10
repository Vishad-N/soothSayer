import { clamp, createRng, lerp, smoothstep } from '../../lib/utils.js'

// Canvas particle network for the Transformation section. Pure drawing: no React, no
// scroll logic. `draw(v, time)` renders the whole network for scroll progress v in 0..1.
// Node positions are a deterministic function of v (so scrubbing is exactly reversible);
// `time` only adds ambient jitter, travelling packets and pulses.

const TAU = Math.PI * 2
export const STAGES = 6
const PATH_NODES = 9 // the signal route; even indexes double as the five workflow hubs
const LANES = [-3, -2, -1, 1, 2, 3] // parallel lanes either side of the route
const LANE_GAP = 0.065
const ASPECT = 1.8 // assumed viz aspect, only used to keep lattice offsets perpendicular
const X0 = 0.06
const X1 = 0.94
const NODE_DELAY = 0.25 // nodes start moving up to this far into a stage (staggered, organic)
const NODE_SPAN = 0.55

// Look per stage: raw data, pattern, signal, intelligence, action, impact.
const LOOK = {
  nodeAlpha: [1, 1, 0.32, 0.82, 0.9, 0.95],
  edgeAlpha: [0, 0.2, 0.09, 0.3, 0.36, 0.4],
  jitter: [1, 0.5, 0.28, 0.14, 0.07, 0.03],
  tint: [0, 0, 0, 0.15, 0.35, 0.5],
  flow: [0, 0, 0, 0, 1, 1],
  pulse: [0, 0, 0, 0, 0.35, 1],
  glow: [0, 0, 1, 0.85, 0.9, 1.25],
}

const curve = (u) => [lerp(X0, X1, u), 0.5 - 0.2 * Math.sin(TAU * (u - 0.5))]
const normal = (u) => {
  const a = curve(u - 0.001)
  const b = curve(u + 0.001)
  const tx = (b[0] - a[0]) * ASPECT
  const ty = b[1] - a[1]
  const len = Math.hypot(tx, ty) || 1
  return [-ty / len / ASPECT, tx / len]
}
// action: lanes braid through the hubs; impact: the bundle rises and tightens to one endpoint
const spreadAction = (u) => {
  const d = Math.abs(((u * 4 + 0.5) % 1) - 0.5)
  return 0.02 + 0.07 * Math.pow(2 * d, 0.9)
}
const centreImpact = (u) => 0.7 - 0.4 * u
const spreadImpact = (u) => 0.075 * (1 - 0.78 * u)

function buildModel(count) {
  const rand = createRng(11)
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5
  const nodes = []
  const randomPoint = () => [0.02 + rand() * 0.96, 0.03 + rand() * 0.94]
  const common = () => ({
    delay: rand() * NODE_DELAY,
    r: 1.8 + rand() * 1.6,
    f1: 0.35 + rand() * 0.6,
    f2: 0.3 + rand() * 0.6,
    p1: rand() * TAU,
    p2: rand() * TAU,
  })

  // --- scattered nodes -------------------------------------------------------------
  const clusters = Array.from({ length: 6 }, (_, k) => [0.1 + (0.8 * (k + 0.5)) / 6 + (rand() - 0.5) * 0.05, 0.2 + rand() * 0.6])
  const loose = count - PATH_NODES
  for (let i = 0; i < loose; i++) {
    const c = clusters[Math.floor(rand() * clusters.length)]
    const l0 = randomPoint()
    let l1 = [c[0] + gauss() * 0.065, c[1] + gauss() * 0.1]
    if (rand() < 0.18) l1 = [lerp(l0[0], l1[0], 0.5), lerp(l0[1], l1[1], 0.5)] // strays
    l1 = [clamp(l1[0], 0.02, 0.98), clamp(l1[1], 0.03, 0.97)]
    nodes.push({ ...common(), path: -1, L: [l0, l1], col: 0, lane: 0 })
  }

  // slot each loose node into a lattice column, ordered by where the cluster put it, so
  // the cluster → lattice move is local and edges don't cross the whole canvas
  const cols = Math.ceil(loose / LANES.length)
  const byX = nodes.map((_, i) => i).sort((a, b) => nodes[a].L[1][0] - nodes[b].L[1][0])
  for (let c = 0; c < cols; c++) {
    const u = (c + 0.5) / cols
    const [cx, cy] = curve(u)
    const [nx, ny] = normal(u)
    const x = lerp(X0, X1, u)
    byX
      .slice(c * LANES.length, (c + 1) * LANES.length)
      .sort((a, b) => nodes[a].L[1][1] - nodes[b].L[1][1])
      .forEach((idx, s) => {
        const n = nodes[idx]
        const lane = LANES[s]
        n.col = c
        n.lane = lane
        const cluster = n.L[1]
        n.L = [
          n.L[0],
          cluster,
          cluster, // signal: everything else holds still and dims
          [cx + nx * lane * LANE_GAP, cy + ny * lane * LANE_GAP],
          [x, 0.5 + lane * spreadAction(u)],
          [x, centreImpact(u) + lane * spreadImpact(u)],
        ]
      })
  }

  // --- the signal route ------------------------------------------------------------
  const path = []
  for (let j = 0; j < PATH_NODES; j++) {
    const u = j / (PATH_NODES - 1)
    const [cx, cy] = curve(u)
    const [nx, ny] = normal(u)
    const off = gauss() * 0.07
    const x = lerp(X0, X1, u)
    path.push(nodes.length)
    nodes.push({
      ...common(),
      path: j,
      col: -1,
      lane: 0,
      L: [randomPoint(), [cx + nx * off, cy + ny * off], [cx, cy], [cx, cy], [x, 0.5], [x, centreImpact(u)]],
    })
  }

  // --- edges: one list, each edge fades in/out per stage via s[stage] ---------------
  const edges = []
  const seen = new Map()
  const link = (a, b, stages) => {
    const key = a < b ? a * 4096 + b : b * 4096 + a
    let e = seen.get(key)
    if (!e) {
      e = { a, b, s: [0, 0, 0, 0, 0, 0] }
      seen.set(key, e)
      edges.push(e)
    }
    stages.forEach((st) => (e.s[st] = 1))
  }

  // pattern: each node links to its two nearest neighbours within reach
  const pt = (n) => n.L[1]
  for (let i = 0; i < nodes.length; i++) {
    const near = []
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue
      const d = Math.hypot((pt(nodes[i])[0] - pt(nodes[j])[0]) * ASPECT, pt(nodes[i])[1] - pt(nodes[j])[1])
      if (d < 0.2) near.push([d, j])
    }
    near.sort((p, q) => p[0] - q[0])
    near.slice(0, 2).forEach(([, j]) => {
      const onRoute = nodes[i].path >= 0 || nodes[j].path >= 0
      link(i, j, onRoute ? [1] : [1, 2]) // the route stands alone once the signal appears
    })
  }

  // intelligence → impact: a lattice that follows the route
  const at = new Map()
  nodes.forEach((n, i) => n.path < 0 && at.set(n.col * 8 + n.lane + 4, i))
  const lattice = [3, 4, 5]
  for (let c = 0; c < cols; c++) {
    for (const lane of LANES) {
      const a = at.get(c * 8 + lane + 4)
      if (a === undefined) continue
      const right = at.get((c + 1) * 8 + lane + 4)
      if (right !== undefined) link(a, right, lattice)
      const inner = at.get(c * 8 + lane + Math.sign(lane) * 1 + 4)
      if (inner !== undefined && Math.abs(lane) < 3) link(a, inner, lattice)
    }
  }
  path.forEach((idx, j) => {
    const c = Math.min(cols - 1, Math.floor((j / (PATH_NODES - 1)) * cols))
    for (const lane of [-1, 1]) {
      const a = at.get(c * 8 + lane + 4)
      if (a !== undefined) link(idx, a, lattice)
    }
  })

  // a handful of lane edges carry packets once the workflow is live
  const carriers = []
  edges.forEach((e, index) => {
    const lane = e.s[4] && nodes[e.a].lane === nodes[e.b].lane && nodes[e.a].col !== nodes[e.b].col
    if (lane && rand() < 0.2) carriers.push({ e, index, offset: rand(), speed: 0.25 + rand() * 0.25 })
  })

  return { nodes, edges, path, carriers }
}

function makeSprite(rgb) {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, `rgba(${rgb},1)`)
  grad.addColorStop(0.16, `rgba(${rgb},0.95)`)
  grad.addColorStop(0.24, `rgba(${rgb},0.3)`)
  grad.addColorStop(0.5, `rgba(${rgb},0.08)`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

export function createNetwork(canvas, { count, reduced }) {
  const ctx = canvas.getContext('2d')
  const { nodes, edges, path, carriers } = buildModel(count)
  const white = makeSprite('226,236,246')
  const cyan = makeSprite('0,217,255')
  const px = new Float32Array(nodes.length)
  const py = new Float32Array(nodes.length)
  const edgeAlpha = new Float32Array(edges.length)
  const edgeBucket = new Uint8Array(edges.length)
  const BUCKETS = 8
  let W = 0
  let H = 0
  let rect = { x: 0, y: 0, w: 1, h: 1 }
  let dprCap = 2

  const sprite = (img, x, y, d, a) => {
    ctx.globalAlpha = a
    ctx.drawImage(img, x - d / 2, y - d / 2, d, d)
  }

  function resize({ panelH = 0, stacked = false } = {}) {
    W = canvas.clientWidth
    H = canvas.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // desktop: the text panel owns the left, the network the rest. stacked: network above the panel
    rect = stacked
      ? { x: W * 0.04, y: 8, w: W * 0.92, h: Math.max(140, H - panelH - 20) }
      : { x: Math.min(380, W * 0.36), y: 14, w: W - Math.min(380, W * 0.36) - 8, h: H - 28 }
  }

  function draw(v, time) {
    if (!W) return
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, W, H)

    const s = clamp(v) * STAGES
    const i = Math.min(STAGES - 1, Math.floor(s))
    const lt = s - i
    const prev = Math.max(0, i - 1)
    const tg = smoothstep(clamp(lt / 0.7))
    const P = (arr) => (i === 0 ? arr[0] : lerp(arr[prev], arr[i], tg))
    const jitterPx = P(LOOK.jitter) * (reduced ? 0 : 6)
    const nodeAlpha = P(LOOK.nodeAlpha)
    const tint = P(LOOK.tint)
    const flow = P(LOOK.flow)
    const pulse = reduced ? 0 : P(LOOK.pulse)
    const glow = P(LOOK.glow)
    // the route lights up node by node while the signal stage plays
    const reveal = i < 2 ? 0 : i === 2 ? smoothstep(clamp(lt / 0.75)) : 1

    // positions
    for (let n = 0; n < nodes.length; n++) {
      const node = nodes[n]
      const L = node.L
      let x = L[i][0]
      let y = L[i][1]
      if (i > 0) {
        const t = smoothstep(clamp((lt - node.delay) / NODE_SPAN))
        x = lerp(L[prev][0], x, t)
        y = lerp(L[prev][1], y, t)
      }
      px[n] = rect.x + x * rect.w + (jitterPx ? Math.sin(time * node.f1 + node.p1) * jitterPx : 0)
      py[n] = rect.y + y * rect.h + (jitterPx ? Math.cos(time * node.f2 + node.p2) * jitterPx : 0)
    }

    // edges, drawn in a few alpha buckets so each bucket is one stroke
    const baseEdge = P(LOOK.edgeAlpha)
    for (let e = 0; e < edges.length; e++) {
      const st = edges[e].s
      const a = (i === 0 ? st[0] : lerp(st[prev], st[i], tg)) * baseEdge
      edgeAlpha[e] = a
      edgeBucket[e] = a < 0.012 ? 255 : Math.min(BUCKETS - 1, Math.floor((a / 0.42) * BUCKETS))
    }
    const warm = clamp(tint * 1.3)
    ctx.lineWidth = 0.8
    for (let b = 0; b < BUCKETS; b++) {
      ctx.beginPath()
      let any = false
      for (let e = 0; e < edges.length; e++) {
        if (edgeBucket[e] !== b) continue
        any = true
        ctx.moveTo(px[edges[e].a], py[edges[e].a])
        ctx.lineTo(px[edges[e].b], py[edges[e].b])
      }
      if (!any) continue
      const a = ((b + 0.5) / BUCKETS) * 0.42
      ctx.strokeStyle = `rgba(${Math.round(lerp(178, 40, warm))},${Math.round(lerp(200, 215, warm))},${Math.round(lerp(222, 250, warm))},${a.toFixed(3)})`
      ctx.stroke()
    }

    // nodes
    for (let n = 0; n < nodes.length; n++) {
      const node = nodes[n]
      const twinkle = 1 - 0.2 * P(LOOK.jitter) * (0.5 + 0.5 * Math.sin(time * node.f2 * 3 + node.p2)) * (reduced ? 0 : 1)
      const a = nodeAlpha * twinkle
      if (node.path >= 0) continue // drawn with the route below
      const d = node.r * 8
      sprite(white, px[n], py[n], d, a)
      sprite(white, px[n], py[n], node.r * 2.6, a) // crisp core so dots stay legible over the ribbons
      if (tint > 0.01) sprite(cyan, px[n], py[n], d, a * tint)
    }

    // the route: soft halo, mid glow, bright core, swept in by `reveal`
    const segs = reveal * (PATH_NODES - 1)
    if (segs > 0) {
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const trace = () => {
        ctx.beginPath()
        ctx.moveTo(px[path[0]], py[path[0]])
        for (let j = 1; j < PATH_NODES; j++) {
          const a = path[j - 1]
          const b = path[j]
          if (j <= segs) ctx.lineTo(px[b], py[b])
          else {
            const f = segs - (j - 1)
            if (f > 0) ctx.lineTo(lerp(px[a], px[b], f), lerp(py[a], py[b], f))
            break
          }
        }
      }
      const passes = [
        [9, 0.09 * glow, '0,217,255'],
        [4, 0.22 * glow, '0,217,255'],
        [1.6, 0.95, '155,243,255'],
      ]
      for (const [w, a, rgb] of passes) {
        trace()
        ctx.lineWidth = w
        ctx.strokeStyle = `rgba(${rgb},${Math.min(1, a).toFixed(3)})`
        ctx.stroke()
      }
    }

    // route nodes
    ctx.globalCompositeOperation = 'lighter'
    for (let j = 0; j < PATH_NODES; j++) {
      const n = path[j]
      const lit = clamp(reveal * PATH_NODES - j)
      const base = nodes[n].r
      const hub = j % 2 === 0
      const r = lerp(base, hub ? 4 : 3, lit)
      const a = lerp(nodeAlpha, 1, lit)
      if (lit < 1) sprite(white, px[n], py[n], base * 8, nodeAlpha * (1 - lit))
      if (lit > 0) sprite(cyan, px[n], py[n], r * 8 * (1 + 0.25 * glow), a)
      if (lit > 0.6) sprite(white, px[n], py[n], r * 3, lit * 0.8)
    }

    // action: packets along the route and on a few lanes, direction chevrons, hub rings
    if (flow > 0.01) {
      ctx.lineCap = 'round'
      ctx.lineWidth = 1.4
      ctx.strokeStyle = `rgba(155,243,255,${(flow * 0.8).toFixed(3)})`
      ctx.beginPath()
      for (let j = 0; j < PATH_NODES - 1; j++) {
        const a = path[j]
        const b = path[j + 1]
        const mx = (px[a] + px[b]) / 2
        const my = (py[a] + py[b]) / 2
        const ang = Math.atan2(py[b] - py[a], px[b] - px[a])
        const k = 4.5
        for (const side of [-1, 1]) {
          ctx.moveTo(mx - Math.cos(ang) * k + Math.cos(ang + side * 2.5) * k * 1.3, my - Math.sin(ang) * k + Math.sin(ang + side * 2.5) * k * 1.3)
          ctx.lineTo(mx + Math.cos(ang) * k, my + Math.sin(ang) * k)
        }
      }
      ctx.stroke()

      if (!reduced) {
        const phase = time * 0.16 + clamp(v) * 4
        for (let k = 0; k < 4; k++) {
          const sPos = (((phase + k / 4) % 1) + 1) % 1 * (PATH_NODES - 1)
          const j = Math.min(PATH_NODES - 2, Math.floor(sPos))
          const f = sPos - j
          const x = lerp(px[path[j]], px[path[j + 1]], f)
          const y = lerp(py[path[j]], py[path[j + 1]], f)
          sprite(cyan, x, y, 18, flow)
          sprite(white, x, y, 6, flow)
        }
        for (const c of carriers) {
          if (edgeAlpha[c.index] < 0.05) continue
          const f = (time * c.speed + c.offset) % 1
          sprite(cyan, lerp(px[c.e.a], px[c.e.b], f), lerp(py[c.e.a], py[c.e.b], f), 8, flow * 0.75)
        }
      }

      ctx.lineWidth = 1.2
      for (let k = 0; k < 5; k++) {
        const n = path[k * 2]
        ctx.strokeStyle = `rgba(0,217,255,${(flow * 0.7).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(px[n], py[n], 9, 0, TAU)
        ctx.stroke()
        if (pulse > 0.01) {
          const ph = (time * 0.45 + k * 0.19) % 1
          ctx.strokeStyle = `rgba(0,217,255,${((1 - ph) * 0.55 * pulse * (k === 4 ? 1.5 : 0.8)).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(px[n], py[n], 9 + 16 * ph, 0, TAU)
          ctx.stroke()
        }
      }
    }

    // impact: a soft, steady bloom on the final endpoint
    const pulseStatic = P(LOOK.pulse)
    if (pulseStatic > 0.01) {
      const end = path[PATH_NODES - 1]
      const breathe = reduced ? 1 : 0.85 + 0.15 * Math.sin(time * 1.6)
      sprite(cyan, px[end], py[end], 150 * pulseStatic, 0.35 * pulseStatic * breathe)
    }

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  return {
    resize,
    draw,
    // called when frames run long: halve the pixel work once, keep everything else
    degrade() {
      if (dprCap > 1) {
        dprCap = 1
        return true
      }
      return false
    },
  }
}
