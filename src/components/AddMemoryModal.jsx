import { useEffect, useRef, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import IconButton from '../ui/IconButton.jsx'
import Field from '../ui/Field.jsx'
import Button from '../ui/Button.jsx'
import './AddMemoryModal.css'

const COLORS = [
  { name: 'pale yellow', hex: '#f0dea0' },
  { name: 'dusty pink', hex: '#e3aab0' },
  { name: 'sage green', hex: '#a0bb8f' },
  { name: 'soft lavender', hex: '#c8bfe0' },
  { name: 'terracotta', hex: '#d98a63' },
  { name: 'sky dust', hex: '#a7c4d4' },
]
const MAX_PHOTOS = 3

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
function tomorrowISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 5 10l7 6" />
    </svg>
  )
}
function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6.5a1 1 0 0 1 1-1h2l1-2h6l1 2h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z" />
      <circle cx="9" cy="10" r="2.6" />
    </svg>
  )
}

export default function AddMemoryModal({ onCancel, onSubmit }) {
  const [step, setStep] = useState('letter')
  const [mode, setMode] = useState('future')
  const [text, setText] = useState('')
  const [date, setDate] = useState(tomorrowISO())
  const [color, setColor] = useState(COLORS[0].hex)
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  const photosRef = useRef(photos)
  photosRef.current = photos
  useEffect(() => {
    return () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url))
  }, [])

  function switchMode(next) {
    setMode(next)
    setDate(next === 'future' ? tomorrowISO() : todayISO())
  }

  function handlePickPhotos(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    setPhotos((prev) => [...prev, ...files.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(0, MAX_PHOTOS))
  }

  function removePhoto(index) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  function goToDetails() {
    if (!text.trim()) {
      setError('write a little something first.')
      return
    }
    setError('')
    setStep('details')
  }

  async function handleSubmit() {
    if (!text.trim() || !date) {
      setError('write something and pick a date first.')
      return
    }
    setSaving(true)
    const { error } = await onSubmit({ text: text.trim(), date, color, photos: photos.map((p) => p.file) })
    setSaving(false)
    if (error) setError(error.message || String(error))
  }

  return (
    <Modal onClose={onCancel} labelledBy="letterTitle">
      <div className="letter-modal">
        <div className="letter-topbar">
          <IconButton label="back" onClick={() => (step === 'letter' ? onCancel() : setStep('letter'))}>
            <BackIcon />
          </IconButton>
          <h1 className="letter-title" id="letterTitle">Love Letter</h1>
          {step === 'letter' ? (
            <button type="button" className="next-step-btn" onClick={goToDetails}>
              Next Step <span aria-hidden="true">→</span>
            </button>
          ) : (
            <span className="topbar-spacer" />
          )}
        </div>

        {step === 'letter' && (
          <>
            <div className="letter-paper">
              <textarea
                className="letter-body"
                maxLength={600}
                placeholder="Start writing your letter here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handlePickPhotos}
            />
            <button
              type="button"
              className="add-photos-btn"
              disabled={photos.length >= MAX_PHOTOS}
              onClick={() => fileInputRef.current?.click()}
            >
              <CameraIcon /> Add photos <span className="photo-count">{photos.length} / {MAX_PHOTOS}</span>
            </button>

            {photos.length > 0 && (
              <div className="photo-thumbs">
                {photos.map((p, i) => (
                  <div key={p.url} className="photo-thumb">
                    <div className="photo-thumb-img" style={{ backgroundImage: `url(${p.url})` }} />
                    <button
                      type="button"
                      className="photo-thumb-remove"
                      aria-label={`remove photo ${i + 1}`}
                      onClick={() => removePhoto(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {step === 'details' && (
          <>
            <p className="date-label">seal a little memory inside</p>
            <div className="mode-tabs" role="radiogroup" aria-label="when this memory happens">
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'future'}
                className={`mode-tab ${mode === 'future' ? 'active' : ''}`}
                onClick={() => switchMode('future')}
              >
                something to look forward to
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'past'}
                className={`mode-tab ${mode === 'past' ? 'active' : ''}`}
                onClick={() => switchMode('past')}
              >
                something that already happened
              </button>
            </div>

            <Field
              label={mode === 'future' ? 'when should it light up?' : 'when did it happen?'}
              htmlFor="memoryDate"
              hint={
                mode === 'future'
                  ? "pick any date from tomorrow onward. it'll stay dark until then."
                  : "this one will glow right away, whenever you seal it in."
              }
            >
              <input
                id="memoryDate"
                type="date"
                value={date}
                min={mode === 'future' ? tomorrowISO() : undefined}
                max={mode === 'past' ? todayISO() : undefined}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>

            <Field label="choose its color">
              <div className="swatches" role="group" aria-label="choose its color">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`swatch ${color === c.hex ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                    aria-pressed={color === c.hex}
                    onClick={() => setColor(c.hex)}
                  />
                ))}
              </div>
            </Field>

            <div className="card-actions">
              <Button variant="secondary" onClick={() => setStep('letter')}>
                back
              </Button>
              <Button variant="primary" loading={saving} onClick={handleSubmit}>
                seal it in
              </Button>
            </div>
          </>
        )}

        <p className="error-text" aria-live="polite">{error}</p>
      </div>
    </Modal>
  )
}
