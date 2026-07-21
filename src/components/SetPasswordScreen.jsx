import { useState } from 'react'
import { supabase } from '../supabaseClient'
import PasswordInput from './PasswordInput.jsx'
import PaperCard from '../ui/PaperCard.jsx'
import Field from '../ui/Field.jsx'
import Button from '../ui/Button.jsx'
import './AuthScreen.css'

export default function SetPasswordScreen() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!password) {
      setMessage('enter a new password.')
      return
    }
    setSaving(true)
    setMessage('saving…')
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) {
      setMessage(error.message)
    } else {
      setDone(true)
      setMessage('password set. you can sign in with it from now on.')
    }
  }

  return (
    <div id="authScreen">
      <PaperCard titleId="setPasswordTitle" title="the firefly jar" subtitle="set a password for your account">
        <Field label="new password" htmlFor="newPassword">
          <PasswordInput
            id="newPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !done && submit()}
          />
        </Field>
        <div className="card-actions">
          <Button variant="primary" loading={saving} disabled={done} onClick={submit}>
            save password
          </Button>
        </div>
        <p className="error-text" aria-live="polite">{message}</p>
      </PaperCard>
    </div>
  )
}
