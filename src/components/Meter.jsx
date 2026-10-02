import { useRef } from 'react'
import { useInView } from '../hooks/useInView.js'
import { cx } from '../lib/utils.js'

const METER_OPTIONS = { threshold: 0.4 }

export default function Meter({ percent }) {
  const ref = useRef(null)
  const inView = useInView(ref, METER_OPTIONS)
  return (
    <div ref={ref} className={cx('ms', inView && 'in')} style={{ '--p': percent }}>
      <i />
    </div>
  )
}
