import './PaperCard.css'

export default function PaperCard({ seal = '✦', title, titleId, subtitle, children, className = '' }) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')}>
      <div className="seal" aria-hidden="true">{seal}</div>
      {title && <h2 id={titleId}>{title}</h2>}
      {subtitle && <p className="date-label">{subtitle}</p>}
      {children}
    </div>
  )
}
