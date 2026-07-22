import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useFireflies } from './hooks/useFireflies.js'
import { useToast } from './ui/ToastProvider.jsx'
import Button from './ui/Button.jsx'
import Background from './components/Background.jsx'
import AccountMenu from './components/AccountMenu.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import SetPasswordScreen from './components/SetPasswordScreen.jsx'
import Jar from './components/Jar.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import AddMemoryModal from './components/AddMemoryModal.jsx'
import ViewMemoryModal from './components/ViewMemoryModal.jsx'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [recovering, setRecovering] = useState(false)
  const notify = useToast()

  const { fireflies, loading, load, addFirefly, markOpened, clearJar } = useFireflies(user)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setCheckingSession(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) load()
  }, [user, load])

  if (checkingSession) {
    return (
      <>
        <Background />
        <LoadingScreen label="waking the jar" />
      </>
    )
  }

  if (user && loading) {
    return (
      <>
        <Background />
        <LoadingScreen label="gathering fireflies" />
      </>
    )
  }

  if (recovering) {
    return (
      <>
        <Background />
        <SetPasswordScreen />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Background />
        <AuthScreen />
      </>
    )
  }

  const today = todayISO()
  const readyCount = fireflies.filter((f) => f.memory_date <= today).length
  const sealedCount = fireflies.length - readyCount
  const countText =
    fireflies.length === 0
      ? 'your jar is empty'
      : [readyCount ? `${readyCount} glowing` : null, sealedCount ? `${sealedCount} still dark` : null]
          .filter(Boolean)
          .join(' · ')

  async function handleSelect(firefly) {
    setViewing(firefly)
    if (firefly.memory_date <= today && !firefly.opened) {
      const { error } = await markOpened(firefly)
      if (error) notify({ type: 'error', message: `couldn't save that this one was opened: ${error.message}` })
    }
  }

  async function handleClearJar() {
    if (!fireflies.length) return
    if (!confirm("Empty the whole jar? This removes every firefly and can't be undone.")) return
    const { error } = await clearJar()
    if (error) notify({ type: 'error', message: `couldn't clear the jar: ${error.message}` })
  }

  return (
    <>
      <Background />
      <div className="wrap">
        <p className="wordmark">the firefly jar</p>
        <p className="tagline">write a memory, choose its light, and let it find its own hour to glow.</p>
        <AccountMenu email={user.email} />
        <p className="count">{countText}</p>

        <Jar fireflies={fireflies} onSelect={handleSelect} />

        <Button variant="cta" onClick={() => setShowAdd(true)}>
          catch a firefly
        </Button>
        <Button variant="subtle" onClick={handleClearJar}>
          clear the jar
        </Button>
      </div>

      {showAdd && (
        <AddMemoryModal
          onCancel={() => setShowAdd(false)}
          onSubmit={async (payload) => {
            const result = await addFirefly(payload)
            if (!result.error) setShowAdd(false)
            return result
          }}
        />
      )}
      {viewing && <ViewMemoryModal firefly={viewing} onClose={() => setViewing(null)} />}
    </>
  )
}
