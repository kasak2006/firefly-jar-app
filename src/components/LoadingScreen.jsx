import './LoadingScreen.css'

// a handful of fireflies in different stationery colours, each drifting and
// pulsing on its own rhythm inside the loading jar
const FLIES = [
  { color: 'var(--pale-yellow)', left: '40%', top: '44%', delay: '0s',    dur: '2.6s' },
  { color: 'var(--dusty-pink)',  left: '60%', top: '36%', delay: '0.45s', dur: '3.2s' },
  { color: 'var(--sage)',        left: '48%', top: '64%', delay: '0.9s',  dur: '2.9s' },
  { color: 'var(--sky-dust)',    left: '64%', top: '58%', delay: '1.3s',  dur: '3.5s' },
  { color: 'var(--lavender)',    left: '36%', top: '30%', delay: '0.7s',  dur: '3.0s' },
]

export default function LoadingScreen({ label = 'loading' }) {
  return (
    <div className="loading-screen" role="status" aria-label={label}>
      <div className="loading-jar">
        <svg className="loading-jar-svg" viewBox="0 0 260 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
          <g stroke="var(--ink)" strokeWidth="1.3" opacity="0.16" fill="none" strokeLinecap="round">
            <path d="M50,150 C90,156 170,144 210,150" />
            <path d="M50,205 C90,211 170,199 210,205" />
            <path d="M50,260 C90,266 170,254 210,260" />
          </g>

          {/* single sketchy shine line */}
          <path d="M70,95 C62,145 62,240 74,300" stroke="var(--ink)" strokeWidth="2" opacity="0.12" strokeLinecap="round" fill="none" />

          {/* lid */}
          <g>
            <rect x="92" y="2" width="76" height="26" rx="6" fill="var(--kraft)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M99,10 C120,12 140,8 161,10" stroke="var(--ink)" strokeWidth="1.3" opacity="0.4" fill="none" strokeLinecap="round" />
            <path d="M99,16 C120,18 140,14 161,16" stroke="var(--ink)" strokeWidth="1.3" opacity="0.4" fill="none" strokeLinecap="round" />
            <path d="M99,22 C120,24 140,20 161,22" stroke="var(--ink)" strokeWidth="1.3" opacity="0.4" fill="none" strokeLinecap="round" />
          </g>
        </svg>

        <div className="loading-field">
          {FLIES.map((f, i) => (
            <span
              key={i}
              className="loading-fly"
              style={{
                '--fc': f.color,
                '--dur': f.dur,
                left: f.left,
                top: f.top,
                animationDelay: f.delay,
              }}
            />
          ))}
        </div>
      </div>

      <p className="loading-caption">
        {label}
        <span className="loading-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </p>
    </div>
  )
}
