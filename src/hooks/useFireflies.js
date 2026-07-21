import { useCallback, useState } from 'react'
import { supabase } from '../supabaseClient'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function useFireflies(user) {
  const [fireflies, setFireflies] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('fireflies')
      .select('*')
      .order('created_at', { ascending: true })
    setFireflies(error ? [] : data)
    setLoading(false)
  }, [user])

  const addFirefly = useCallback(
    async ({ text, date, color, photos = [] }) => {
      if (!user) return { error: new Error('not signed in') }

      const photoUrls = []
      for (const file of photos) {
        const path = `${user.id}/${crypto.randomUUID()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('firefly-photos').upload(path, file)
        if (uploadError) return { error: uploadError }
        const { data } = supabase.storage.from('firefly-photos').getPublicUrl(path)
        photoUrls.push(data.publicUrl)
      }

      const row = {
        user_id: user.id,
        memory_text: text,
        memory_date: date,
        created_on: todayISO(),
        color,
        opened: false,
        notified: false,
        pos_x: 22 + Math.random() * 56,
        pos_y: 22 + Math.random() * 52,
        drift_x: Math.random() * 40 - 20,
        drift_y: Math.random() * 36 - 30,
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 3,
        photos: photoUrls,
      }
      const { error } = await supabase.from('fireflies').insert(row)
      if (!error) await load()
      return { error }
    },
    [user, load]
  )

  const markOpened = useCallback(async (firefly) => {
    setFireflies((prev) =>
      prev.map((f) => (f.id === firefly.id ? { ...f, opened: true } : f))
    )
    const { error } = await supabase.from('fireflies').update({ opened: true }).eq('id', firefly.id)
    return { error }
  }, [])

  const clearJar = useCallback(async () => {
    if (!user) return { error: new Error('not signed in') }
    const { error } = await supabase.from('fireflies').delete().eq('user_id', user.id)
    if (!error) await load()
    return { error }
  }, [user, load])

  return { fireflies, loading, load, addFirefly, markOpened, clearJar }
}
