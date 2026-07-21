import Spinner from './Spinner.jsx'
import './Button.css'

const VARIANT_CLASS = {
  cta: 'btn',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  link: 'link-btn',
  subtle: 'clear-link',
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.primary
  return (
    <button
      type={type}
      className={[variantClass, className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      <span className={loading ? 'btn-label-loading' : undefined}>{children}</span>
    </button>
  )
}
