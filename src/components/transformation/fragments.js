// Deterministic shard geometry: the card face is cut into a jittered grid of triangles.
// Everything is computed from a pure hash, so React re-renders never move a fragment.
const hash = (a, b, k) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + k * 74.7) * 43758.5453
  return s - Math.floor(s)
}

const round = (n) => Math.round(n * 10) / 10

// `reach` scales the outward travel (smaller on phones).
function buildFragments(cols, rows, reach) {
  const verts = []
  for (let r = 0; r <= rows; r++) {
    verts[r] = []
    for (let c = 0; c <= cols; c++) {
      const jx = c > 0 && c < cols ? (hash(r, c, 1) - 0.5) * (100 / cols) * 0.5 : 0
      const jy = r > 0 && r < rows ? (hash(r, c, 2) - 0.5) * (100 / rows) * 0.5 : 0
      verts[r][c] = [(c / cols) * 100 + jx, (r / rows) * 100 + jy]
    }
  }

  const frags = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = verts[r][c]
      const tr = verts[r][c + 1]
      const bl = verts[r + 1][c]
      const br = verts[r + 1][c + 1]
      const tris = (r + c) % 2 ? [[tl, tr, br], [tl, br, bl]] : [[tl, tr, bl], [tr, br, bl]]
      for (const tri of tris) {
        const n = frags.length
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
        frags.push({
          clip: `polygon(${tri.map(([x, y]) => `${round(x)}% ${round(y)}%`).join(',')})`,
          origin: `${round(cx)}% ${round(cy)}%`,
          // outward from the card centre, plus a fixed per-shard wobble
          x: round(((cx - 50) / 50) * 250 * reach + (hash(n, 3, 3) - 0.5) * 70 * reach),
          y: round(((cy - 50) / 50) * 160 * reach + (hash(n, 4, 4) - 0.5) * 60 * reach),
          rotation: round((hash(n, 5, 5) - 0.5) * 50),
          scale: round(0.55 + hash(n, 6, 6) * 0.35),
        })
      }
    }
  }
  return frags
}

export const DESKTOP_FRAGMENTS = buildFragments(4, 2, 1) // 16 shards
export const MOBILE_FRAGMENTS = buildFragments(3, 2, 0.6) // 12 shards
