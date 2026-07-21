import { motion } from 'framer-motion'
import './Firefly.css'

function isReady(dateISO) {
  return dateISO <= new Date().toISOString().slice(0, 10)
}

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Firefly({ firefly, onClick }) {
  const ready = isReady(firefly.memory_date)
  const stateClass = ready ? (firefly.opened ? 'opened' : 'ready') : ''
  const label = ready
    ? firefly.opened
      ? `memory from ${fmtDate(firefly.memory_date)}, already read`
      : `memory from ${fmtDate(firefly.memory_date)}, ready to read`
    : `memory sealed until ${fmtDate(firefly.memory_date)}, still dark`

  return (
    <div className="firefly-pos" style={{ left: `${firefly.pos_x}%`, top: `${firefly.pos_y}%` }}>
      <motion.button
        type="button"
        className={`firefly ${stateClass}`}
        style={{ '--fc': firefly.color || '#e7bd6c' }}
        aria-label={label}
        animate={{
          x: [0, Number(firefly.drift_x) || 10, 0],
          y: [0, Number(firefly.drift_y) || -14, 0],
          opacity: ready ? [0.75, 1, 0.75] : [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: Number(firefly.duration) || 7,
          delay: Number(firefly.delay) || 0,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={onClick}
      />
    </div>
  )
}
