import { useState } from 'react'
import IconButton from '../ui/IconButton.jsx'

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 9C3 4.2 6.8 2 9 2s6 2.2 8 7c-2 4.8-5.8 7-8 7s-6-2.2-8-7Z" />
      <circle cx="9" cy="9" r="2.4" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 9C3 4.2 6.8 2 9 2s6 2.2 8 7c-2 4.8-5.8 7-8 7s-6-2.2-8-7Z" />
      <circle cx="9" cy="9" r="2.4" />
      <line x1="2" y1="16" x2="16" y2="2" />
    </svg>
  )
}

export default function PasswordInput({ id, value, onChange, onKeyDown, placeholder = '••••••••' }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <IconButton label={visible ? 'hide password' : 'show password'} onClick={() => setVisible((v) => !v)}>
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </IconButton>
    </div>
  )
}
