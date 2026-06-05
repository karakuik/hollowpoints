import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Nav from '../components/Nav'
import Meta from '../components/Meta'
import { supabase } from '../lib/supabase'
import { pinColor } from '../lib/pinColors'

function makePinIcon(color, size = 10) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px; height:${size}px;
      background:${color};
      border-radius:50%;
      border:2px solid rgba(255,255,255,0.35);
      box-shadow:0 0 8px ${color}99, 0 0 16px ${color}44;
    "></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2 + 4)],
  })
}

const NEW_PIN_ICON = makePinIcon('#ffffff', 14)

// ── click-to-drop layer ────────────────────────────────────────────────────────
function DropLayer({ active, onDrop }) {
  useMapEvents({
    click(e) { if (active) onDrop(e.latlng) },
  })
  return null
}

// ── main page ──────────────────────────────────────────────────────────────────
export default function VisitorMap() {
  const [pins,     setPins]     = useState([])
  const [dropping, setDropping] = useState(false)
  const [pending,  setPending]  = useState(null)   // { lat, lng }
  const [label,    setLabel]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    supabase.from('visitor_pins').select('id,lat,lng,label,created_at').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPins(data) })
  }, [])

  const handleDrop = useCallback((latlng) => {
    setPending(latlng)
    setDropping(false)
    setLabel('')
    setSaved(false)
  }, [])

  async function submitPin() {
    if (!pending) return
    setSaving(true)
    const entry = {
      lat:   Math.round(pending.lat * 1e6) / 1e6,
      lng:   Math.round(pending.lng * 1e6) / 1e6,
      label: label.trim().slice(0, 60) || null,
    }
    const { data, error } = await supabase.from('visitor_pins').insert(entry).select().single()
    setSaving(false)
    if (!error && data) {
      setPins(p => [data, ...p])
      setPending(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  function cancelDrop() {
    setPending(null)
    setDropping(false)
  }

  return (
    <div className="min-h-screen bg-hp-bg text-hp-text">
      <Nav />
      <Meta title="Visitor Map" description="Drop a pin and show the world where you're from." />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Community</p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold text-hp-text">Visitor Map</h1>
            <p className="text-hp-muted text-sm mt-1.5">
              {pins.length} {pins.length === 1 ? 'visitor' : 'visitors'} from around the world.
              Drop your pin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-400 text-xs font-semibold">Pin dropped ✓</span>
            )}
            {pending ? (
              <>
                <button onClick={cancelDrop} className="text-xs text-hp-muted hover:text-hp-text border border-hp-border px-3 py-1.5 rounded transition-colors">
                  Cancel
                </button>
                <button onClick={submitPin} disabled={saving} className="text-xs font-semibold bg-hp-accent hover:bg-hp-accent/90 disabled:opacity-50 text-white px-4 py-1.5 rounded transition-colors">
                  {saving ? 'Saving…' : 'Drop here →'}
                </button>
              </>
            ) : (
              <button
                onClick={() => { setDropping(d => !d); setPending(null) }}
                className={`text-xs font-semibold px-4 py-1.5 rounded border transition-colors ${
                  dropping
                    ? 'bg-hp-accent/15 text-hp-accent border-hp-accent/40'
                    : 'bg-hp-surface border-hp-border text-hp-muted hover:text-hp-text'
                }`}
              >
                {dropping ? '← Click the map to place pin' : '+ Drop your pin'}
              </button>
            )}
          </div>
        </div>

        {/* Label input when a pending pin is placed */}
        {pending && (
          <div className="mt-4 flex items-center gap-3 bg-hp-surface border border-hp-accent/30 rounded-lg px-4 py-3 max-w-md">
            <span className="text-hp-accent text-sm">📍</span>
            <input
              autoFocus
              value={label}
              onChange={e => setLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitPin()}
              maxLength={60}
              placeholder="Your name or city (optional)"
              className="flex-1 bg-transparent text-sm text-hp-text placeholder:text-hp-muted focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Map */}
      <div className={`mx-0 transition-all ${dropping ? 'cursor-crosshair' : ''}`}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxBounds={[[-85, -180], [85, 180]]}
          style={{ height: '60vh', width: '100%', background: '#09090f' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />

          <DropLayer active={dropping || false} onDrop={handleDrop} />

          {/* Existing pins */}
          {pins.map(pin => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={makePinIcon(pinColor(pin.id))}>
              {pin.label && (
                <Popup className="hp-popup">
                  <span style={{ color: '#e8eaf0', fontSize: '12px', fontWeight: 600 }}>
                    {pin.label}
                  </span>
                </Popup>
              )}
            </Marker>
          ))}

          {/* Pending pin preview */}
          {pending && (
            <Marker position={[pending.lat, pending.lng]} icon={NEW_PIN_ICON} />
          )}
        </MapContainer>
      </div>

      {/* Recent pins list */}
      {pins.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-[10px] text-hp-muted uppercase tracking-widest mb-4">Recent visitors</p>
          <div className="flex flex-wrap gap-2">
            {pins.filter(p => p.label).slice(0, 30).map(pin => (
              <span
                key={pin.id}
                className="text-xs bg-hp-surface border border-hp-border text-hp-muted px-3 py-1 rounded-full"
              >
                {pin.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .leaflet-container { font-family: inherit; }
        .leaflet-control-zoom a {
          background: #12141c !important;
          color: #6b7280 !important;
          border-color: #252836 !important;
        }
        .leaflet-control-zoom a:hover { color: #e8eaf0 !important; }
        .leaflet-control-attribution {
          background: rgba(9,9,15,0.7) !important;
          color: #6b7280 !important;
        }
        .leaflet-control-attribution a { color: #6b7280 !important; }
        .leaflet-popup-content-wrapper {
          background: #12141c !important;
          border: 1px solid #252836 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6) !important;
        }
        .leaflet-popup-tip { background: #12141c !important; }
      `}</style>
    </div>
  )
}
