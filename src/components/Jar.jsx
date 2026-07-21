import Firefly from './Firefly.jsx'
import './Jar.css'

export default function Jar({ fireflies, onSelect }) {
  return (
    <div className="jar-stage">
      {/* objectBoundingBox clip path so .firefly-field clips to the jar's silhouette
          at any size — the path below is the original 260x340 hand-drawn jar
          outline with each coordinate divided by its axis size (x/260, y/340). */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <clipPath id="fireflyJarClip" clipPathUnits="objectBoundingBox">
            <path d="M0.3846,0.0765L0.6154,0.0765L0.6154,0.1618C0.6923,0.1853 0.8154,0.2294 0.8154,0.3235L0.8154,0.8412C0.8154,0.9059 0.7500,0.9353 0.6615,0.9353L0.3385,0.9353C0.2500,0.9353 0.1846,0.9059 0.1846,0.8412L0.1846,0.3235C0.1846,0.2294 0.3077,0.1853 0.3846,0.1618L0.3846,0.0765Z" />
          </clipPath>
        </defs>
      </svg>

      <svg className="jar-svg" viewBox="0 0 260 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* string + gift-tag, hand-drawn accent */}
        <g>
          <path
            d="M100,14 C82,8 64,14 56,28 C52,36 58,44 68,40"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g transform="translate(28,32) rotate(-15)">
            <path
              d="M0,10 L16,-2 L34,-2 L34,22 L16,22 Z"
              fill="var(--kraft)"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="10" r="2" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
          </g>
        </g>

        {/* faint duplicate outline behind the main body, for a sketched double-line wobble */}
        <path
          d="M101,27 L159,27 L159,56 C179,64 211,79 211,111 L211,285 C211,307 194,317 171,317 L89,317 C66,317 49,307 49,285 L49,111 C49,79 81,64 101,56 L101,27 Z"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.4"
          opacity="0.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* main jar body — flat paper fill, ink outline */}
        <path
          d="M100,26 L160,26 L160,55 C180,63 212,78 212,110 L212,286 C212,308 195,318 172,318 L88,318 C65,318 48,308 48,286 L48,110 C48,78 80,63 100,55 L100,26 Z"
          fill="var(--paper-card)"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* hand-drawn waterline squiggles */}
        <g stroke="var(--ink)" strokeWidth="1.3" opacity="0.18" fill="none" strokeLinecap="round">
          <path d="M50,140 C90,146 170,134 210,140" />
          <path d="M50,175 C90,181 170,169 210,175" />
          <path d="M50,210 C90,216 170,204 210,210" />
          <path d="M50,245 C90,251 170,239 210,245" />
        </g>

        {/* single sketchy shine line */}
        <path d="M70,90 C62,140 62,240 74,300" stroke="var(--ink)" strokeWidth="2" opacity="0.14" strokeLinecap="round" fill="none" />

        {/* lid */}
        <g>
          <rect x="92" y="2" width="76" height="26" rx="6" fill="var(--kraft)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M99,10 C120,12 140,8 161,10" stroke="var(--ink)" strokeWidth="1.3" opacity="0.4" fill="none" strokeLinecap="round" />
          <path d="M99,16 C120,18 140,14 161,16" stroke="var(--ink)" strokeWidth="1.3" opacity="0.4" fill="none" strokeLinecap="round" />
          <path d="M99,22 C120,24 140,20 161,22" stroke="var(--ink)" strokeWidth="1.3" opacity="0.4" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      <div className="firefly-field">
        {fireflies.length === 0 && (
          <p className="empty-note">no fireflies yet — catch your first one below</p>
        )}
        {fireflies.map((f) => (
          <Firefly key={f.id} firefly={f} onClick={() => onSelect(f)} />
        ))}
      </div>
      <div className="jar-shadow" />
    </div>
  )
}
