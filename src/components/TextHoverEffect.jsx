import { useRef, useState } from 'react'

// Hollow outlined wordmark: it draws itself in on load; hovering reveals a glowing brand-colour
// gradient stroke under the cursor and fades in the smaller solid-white `subText` line beneath. The mask moves via direct attribute writes, so pointer
// movement never triggers a React re-render.
//
// Hollow without internal lines: variable-font glyphs are built from overlapping contours, so a
// plain stroke also traces shapes inside the letters. Instead every stroke is masked by the
// inverse of the filled text (the union silhouette), which keeps only the outer edge.
const MAIN = { x: 150, y: 28, length: 288 }
const SUB = { x: 150, y: 68, length: 150 }

function Line({ className, line, children, ...rest }) {
  return (
    <text className={className} x={line.x} y={line.y} textLength={line.length} lengthAdjust={line.adjust} aria-hidden="true" {...rest}>
      {children}
    </text>
  )
}

export default function TextHoverEffect({ text, subText, className }) {
  const svgRef = useRef(null)
  const maskRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const main = { ...MAIN, adjust: 'spacingAndGlyphs' }
  const sub = { ...SUB, adjust: 'spacing' }

  const onPointerMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    maskRef.current.setAttribute('cx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    maskRef.current.setAttribute('cy', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <svg
      ref={svgRef}
      className={`the${hovered ? ' on' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 300 84"
      role="img"
      aria-label={subText ? `${text} ${subText}` : text}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={onPointerMove}
    >
      <defs>
        <linearGradient id="theGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
          <stop offset="0%" stopColor="#1677ff" />
          <stop offset="35%" stopColor="#00d9ff" />
          <stop offset="65%" stopColor="#9bf3ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <radialGradient id="theReveal" ref={maskRef} gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="20%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="theMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#theReveal)" />
        </mask>
        {/* everything outside the letters stays visible; the letters themselves are cut out */}
        <mask id="theHollow" maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="124">
          <rect x="-20" y="-20" width="340" height="124" fill="white" />
          <Line className="the-hole" line={main}>
            {text}
          </Line>
        </mask>
      </defs>
      <g mask="url(#theHollow)">
        <Line className="the-base" line={main}>
          {text}
        </Line>
        <Line className="the-draw" line={main}>
          {text}
        </Line>
        <Line className="the-glow" line={main} stroke="url(#theGradient)" mask="url(#theMask)">
          {text}
        </Line>
      </g>
      {subText && (
        <Line className="the-sub" line={sub}>
          {subText}
        </Line>
      )}
    </svg>
  )
}
