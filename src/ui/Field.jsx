import './Field.css'

export default function Field({ label, htmlFor, hint, children, className = '' }) {
  return (
    <div className={['field', className].filter(Boolean).join(' ')}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  )
}
