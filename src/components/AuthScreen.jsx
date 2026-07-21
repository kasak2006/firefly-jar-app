import { useState } from 'react'
import { supabase } from '../supabaseClient'
import PasswordInput from './PasswordInput.jsx'
import PaperCard from '../ui/PaperCard.jsx'
import Field from '../ui/Field.jsx'
import Button from '../ui/Button.jsx'
import './AuthScreen.css'

export default function AuthScreen() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function forgotPassword() {
    if (!email) {
      setMessage('enter your email first, then click "forgot password".')
      return
    }
    setSending(true)
    setMessage('sending…')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    setSending(false)
    setMessage(error ? error.message : 'check your inbox for a link to set your password.')
  }

  async function submit() {
    if (!email || !password) {
      setMessage('enter an email and password.')
      return
    }
    setSending(true)
    setMessage(mode === 'signup' ? 'creating account…' : 'signing in…')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      })
      setSending(false)
      setMessage(error ? error.message : 'check your inbox for a confirmation link, then sign in.')
      if (!error) setMode('signin')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setSending(false)
      setMessage(error ? error.message : '')
    }
  }

  return (
    <div id="authScreen">
      <PaperCard titleId="authTitle" title="the firefly jar" subtitle="a place to keep what you don't want to forget">
        <Field label="your email" htmlFor="authEmail">
          <input
            id="authEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </Field>
        <Field label="password" htmlFor="authPassword">
          <PasswordInput
            id="authPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </Field>
        <p className="hint">
          {mode === 'signup'
            ? "we'll send a confirmation link to verify it's really your inbox."
            : 'new here?'}{' '}
          <Button
            variant="link"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup')
              setMessage('')
            }}
          >
            {mode === 'signup' ? 'sign in instead' : 'create an account'}
          </Button>
        </p>
        <div className="card-actions">
          <Button variant="primary" loading={sending} onClick={submit}>
            {mode === 'signup' ? 'create account' : 'sign in'}
          </Button>
        </div>
        {mode === 'signin' && (
          <p className="hint">
            <Button variant="link" onClick={forgotPassword} disabled={sending}>
              forgot password?
            </Button>
          </p>
        )}
        <p className="error-text" aria-live="polite">{message}</p>
      </PaperCard>
    </div>
  )
}
