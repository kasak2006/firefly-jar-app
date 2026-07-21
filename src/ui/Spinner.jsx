import './Spinner.css'

export default function Spinner({ size = 'sm', label = 'loading', className = '' }) {
  return (
    <span
      className={['spinner', `spinner-${size}`, className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
    />
  )
}
