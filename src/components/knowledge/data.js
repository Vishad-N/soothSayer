// Every position is a fraction of the stage (x → width, y → height) for the card's top-left.
//   c0: where the card starts (scattered)   c1: after "connection" (clustered)   c2: final composition
// Cards flagged `core` form the central intelligence cluster that gains emphasis at the end.

export const CARDS = [
  { id: 'pred', label: 'Predictive analytics', title: 'Demand forecasting', desc: 'Risk + opportunity signals', core: true },
  { id: 'data', label: 'Enterprise data', title: 'Unified data foundation', desc: 'Governed, trusted, ready', core: true },
  { id: 'supply', label: 'Supply chain', title: 'Network visibility', desc: 'From forecast to fulfilment' },
  { id: 'genai', label: 'Generative AI', title: 'Grounded assistants', desc: 'Answers from your content' },
  { id: 'doc', label: 'Document intelligence', title: 'Extract + validate', desc: 'Contracts, forms, invoices' },
  { id: 'domain', label: 'Domain expertise', title: 'Industry context', desc: 'Built through experience', core: true },
  { id: 'ind', label: 'Industry patterns', title: 'Cross-sector learning', desc: 'Shared across engagements', core: true },
  { id: 'opt', label: 'Optimization', title: 'Constrained decisions', desc: 'Best path under real limits' },
  { id: 'ops', label: 'Operations', title: 'Workflow intelligence', desc: 'Insight where work happens' },
  { id: 'dec', label: 'Decision intelligence', title: 'Recommended actions', desc: 'From signal to decision' },
  { id: 'strat', label: 'AI strategy', title: 'Use-case priorities', desc: 'A value-ranked roadmap' },
  { id: 'resp', label: 'Responsible AI', title: 'Controls + oversight', desc: 'Traceable by design' },
]

const at = (c0, c2, extra = {}) => ({ c0, c2, ...extra })

// Wide: loose constellation. Three working clusters (predict · create · optimise) plus the
// core cluster that links them. `push` pulls core cards apart until the compounding stage.
const DESKTOP = {
  card: { w: 0.15, h: 0.12 },
  pos: {
    pred: at([0.75, 0.52], [0.44, 0.06], { wf: 1.12, push: [-0.02, -0.03] }),
    data: at([0.06, 0.72], [0.63, 0.12], { push: [0.03, -0.02] }),
    supply: at([0.52, 0.26], [0.8, 0.26]),
    genai: at([0.75, 0.04], [0.04, 0.58]),
    doc: at([0.52, 0.52], [0.21, 0.68]),
    domain: at([0.52, 0.04], [0.31, 0.52], { wf: 1.06, push: [-0.03, 0.02] }),
    ind: at([0.75, 0.72], [0.55, 0.36], { push: [0, 0.035] }),
    opt: at([0.06, 0.52], [0.5, 0.62]),
    ops: at([0.29, 0.72], [0.69, 0.55]),
    dec: at([0.75, 0.26], [0.6, 0.79]),
    strat: at([0.52, 0.72], [0.8, 0.74]),
    resp: at([0.29, 0.52], [0.04, 0.78]),
  },
  intra: [
    ['pred', 'data'], ['data', 'supply'],
    ['genai', 'doc'], ['doc', 'domain'], ['genai', 'resp'],
    ['opt', 'ops'], ['opt', 'dec'], ['dec', 'strat'],
  ],
  cross: [['pred', 'ind'], ['data', 'ind'], ['ind', 'domain'], ['ind', 'opt'], ['ind', 'ops'], ['pred', 'domain']],
}

// Tablet: two columns, ten cards, reading order follows the clusters.
const col = (side, row) => [side ? 0.53 : 0.04, 0.32 + row * 0.125 + (side ? 0.035 : 0)]
const TABLET = {
  card: { w: 0.43, h: 0.1 },
  pos: {
    pred: at([0.53, 0.32 + 4 * 0.125 + 0.035], col(0, 0)),
    data: at([0.04, 0.32 + 3 * 0.125], col(1, 0)),
    supply: at([0.53, 0.32 + 0.035], col(0, 1)),
    domain: at([0.04, 0.32 + 4 * 0.125], col(1, 1), { push: [0.02, 0] }),
    genai: at([0.53, 0.32 + 2 * 0.125 + 0.035], col(0, 2)),
    doc: at([0.04, 0.32], col(1, 2)),
    opt: at([0.04, 0.32 + 2 * 0.125], col(0, 3)),
    ops: at([0.53, 0.32 + 3 * 0.125 + 0.035], col(1, 3)),
    dec: at([0.04, 0.32 + 0.13], col(0, 4)),
    strat: at([0.53, 0.32 + 0.13 + 0.035], col(1, 4)),
  },
  intra: [['pred', 'data'], ['pred', 'supply'], ['genai', 'doc'], ['opt', 'ops'], ['opt', 'dec'], ['dec', 'strat']],
  cross: [['data', 'domain'], ['domain', 'doc'], ['supply', 'genai'], ['domain', 'ops']],
}

// Phone: one column of eight cards. Starts evenly spaced, then pulls into three clusters.
const row = (i) => 0.01 + i * 0.122
const PHONE = {
  card: { w: 0.78, h: 0.096 },
  pos: {
    pred: at([0.11, row(0)], [0.04, 0.01]),
    data: at([0.11, row(5)], [0.18, 0.12]),
    supply: at([0.11, row(2)], [0.06, 0.23]),
    genai: at([0.11, row(7)], [0.18, 0.38]),
    doc: at([0.11, row(1)], [0.04, 0.49]),
    domain: at([0.11, row(4)], [0.18, 0.6], { push: [0, 0.01] }),
    opt: at([0.11, row(3)], [0.06, 0.75]),
    dec: at([0.11, row(6)], [0.18, 0.86]),
  },
  intra: [['pred', 'data'], ['data', 'supply'], ['genai', 'doc'], ['doc', 'domain'], ['opt', 'dec']],
  cross: [['supply', 'genai'], ['domain', 'opt']],
}

export const LAYOUTS = { desktop: DESKTOP, tablet: TABLET, phone: PHONE }

// Quadratic curve between the centres of two cards, bowed sideways so it reads as a link.
export function linkPath(layout, aId, bId, bend = 0.14) {
  const { card, pos } = layout
  const centre = (id) => {
    const p = pos[id]
    const wf = p.wf ?? 1
    return [p.c2[0] + (card.w * wf) / 2, p.c2[1] + card.h / 2]
  }
  const a = centre(aId)
  const b = centre(bId)
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const cx = (a[0] + b[0]) / 2 - dy * bend
  const cy = (a[1] + b[1]) / 2 + dx * bend
  const f = (n) => (n * 100).toFixed(2)
  return `M${f(a[0])} ${f(a[1])} Q${f(cx)} ${f(cy)} ${f(b[0])} ${f(b[1])}`
}
