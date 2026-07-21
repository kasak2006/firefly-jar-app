import Modal from '../ui/Modal.jsx'
import PaperCard from '../ui/PaperCard.jsx'
import Button from '../ui/Button.jsx'

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}
function isReady(dateISO) {
  return dateISO <= new Date().toISOString().slice(0, 10)
}

export default function ViewMemoryModal({ firefly, onClose }) {
  const ready = isReady(firefly.memory_date)

  return (
    <Modal onClose={onClose} labelledBy="viewMemoryTitle">
      <PaperCard
        titleId="viewMemoryTitle"
        title={ready ? (firefly.opened ? 'a familiar glow' : 'a firefly lights up') : 'still dark'}
        subtitle={ready ? `written ${fmtDate(firefly.created_on)} · lit ${fmtDate(firefly.memory_date)}` : ''}
      >
        <p className="memory-text">
          {ready
            ? firefly.memory_text
            : `this one hasn't lit up yet. it's waiting for ${fmtDate(firefly.memory_date)}.`}
        </p>
        {ready && firefly.photos?.length > 0 && (
          <div className="photo-thumbs">
            {firefly.photos.map((url) => (
              <div key={url} className="photo-thumb">
                <div className="photo-thumb-img" style={{ backgroundImage: `url(${url})` }} />
              </div>
            ))}
          </div>
        )}
        <div className="card-actions">
          <Button variant="primary" onClick={onClose}>
            keep it in the jar
          </Button>
        </div>
      </PaperCard>
    </Modal>
  )
}
