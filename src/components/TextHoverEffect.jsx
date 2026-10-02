import { useRef, useState } from 'react'

// Outlined wordmark that draws itself in on load, then reveals a glowing brand-colour
// gradient stroke under the cursor. The mask follows the pointer via direct attribute
// writes, so mouse movement never triggers a React re-render.
export default function TextHoverEffect({ text, className }) {
  const svgRef = useRef(null)
  const maskRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const onPointerMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    maskRef.current.setAttribute('cx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    maskRef.current.setAttribute('cy', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <svg
      ref={svgRef}
      className={`the${hovered ? ' on' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 300 56"
      role="img"
      aria-label={text}
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
      </defs>
      {/* textLength pins the word to the viewBox width, so it always fits whatever font loads */}
      <text className="the-base" x="50%" y="50%" textLength="288" lengthAdjust="spacingAndGlyphs" aria-hidden="true">
        {text}
      </text>
      <text className="the-draw" x="50%" y="50%" textLength="288" lengthAdjust="spacingAndGlyphs" aria-hidden="true">
        {text}
      </text>
      <text
        className="the-glow"
        x="50%"
        y="50%"
        textLength="288"
        lengthAdjust="spacingAndGlyphs"
        stroke="url(#theGradient)"
        mask="url(#theMask)"
        aria-hidden="true"
      >
        {text}
      </text>
    </svg>
  )
}
