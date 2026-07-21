import './IconButton.css'

export default function IconButton({ label, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={['icon-btn', className].filter(Boolean).join(' ')}
      aria-label={label}
      {...rest}
    >
      {children}
    </button>
  )
}
