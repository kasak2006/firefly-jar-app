import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useTheme } from '../hooks/useTheme.js'
import { useToast } from '../ui/ToastProvider.jsx'
import './AccountMenu.css'

const THEMES = [
  { value: 'light', label: 'light' },
  { value: 'system', label: 'auto' },
  { value: 'dark', label: 'dark' },
]

export default function AccountMenu({ email }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const toggleRef = useRef(null)
  const { theme, setTheme } = useTheme()
  const notify = useToast()

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  async function handleSignOut() {
    setOpen(false)
    const { error } = await supabase.auth.signOut()
    if (error) notify({ type: 'error', message: `couldn't sign out: ${error.message}` })
  }

  return (
    <div className="account-wrap" ref={wrapRef}>
      <button
        ref={toggleRef}
        className="account-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        account
      </button>
      {open && (
        <motion.div
          className="account-dropdown"
          role="menu"
          aria-label="account"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <p className="account-email">{email}</p>
          <div className="account-theme" role="group" aria-label="theme">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="menuitemradio"
                aria-checked={theme === t.value}
                className={theme === t.value ? 'active' : ''}
                onClick={() => setTheme(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="account-signout" role="menuitem" onClick={handleSignOut}>
            sign out
          </button>
        </motion.div>
      )}
    </div>
  )
}
